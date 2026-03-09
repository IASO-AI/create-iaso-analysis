## Context

当前项目 `create-iaso-analysis` 是一个空的 npm 包，需要实现一个脚手架 CLI 工具。该工具需要支持从 GitHub 模版仓库下载并初始化项目，支持多种使用场景。

## Goals / Non-Goals

### Goals

- 提供简洁的 CLI 交互体验
- 支持灵活的目标路径配置
- 自动化项目初始化流程（clone、复制、安装依赖）
- 良好的错误处理和用户提示

### Non-Goals

- 不支持模版变量替换，保持实现简单
- 不支持自定义模版引擎
- 不支持离线缓存模版

## Decisions

### 1. 技术栈选择

**决策**：使用 TypeScript + Node.js，配合以下库：
- `commander` - 命令行参数解析
- `prompts` 或 `@inquirer/prompts` - 交互式提示
- `execa` - 子进程执行（git、npm 等）
- `picocolors` - 终端颜色输出
- `fs-extra` - 文件操作增强

**理由**：
- TypeScript 提供类型安全，减少运行时错误
- 这些库都是成熟的、广泛使用的工具
- 保持轻量，避免过度依赖

**考虑的替代方案**：
- `yargs` 代替 `commander`：被拒绝，commander API 更简洁
- `ora` 代替手动状态输出：被拒绝，增加依赖，手动实现足够简单

### 2. GitHub 仓库识别规则

**决策**：使用以下规则区分路径和 GitHub 仓库：

是 GitHub 仓库的条件：
- 以 `http://` 或 `https://` 开头
- 以 `git@` 开头
- 匹配模式 `owner/repo`（包含 `/` 但不以 `.` 或 `/` 开头）

否则视为本地路径。

**理由**：覆盖常见的 GitHub 地址格式，同时避免误判本地路径。

### 3. 冲突处理策略

**决策**：采用目录级别冲突检测。

检测规则：
- 如果目标目录非空，检查是否存在与模版文件同名的文件
- 如果存在冲突，提示用户选择：覆盖全部 / 取消操作

**理由**：文件级别处理过于复杂，且容易让用户困惑。目录级别简单直观。

### 4. 项目结构

**决策**：采用以下目录结构：

```
create-iaso-analysis/
├── src/
│   ├── index.ts          # CLI 入口
│   ├── cli.ts            # 命令行解析
│   ├── prompts.ts        # 交互式提示
│   ├── actions/
│   │   ├── clone.ts      # Git clone 操作
│   │   ├── copy.ts       # 文件复制
│   │   ├── install.ts    # 依赖安装
│   │   └── init.ts       # Git init
│   ├── utils/
│   │   ├── path.ts       # 路径处理
│   │   ├── git.ts        # Git 工具函数
│   │   └── logger.ts     # 日志输出
│   └── types.ts          # 类型定义
├── package.json
└── tsconfig.json
```

**理由**：按功能模块划分，便于维护和测试。

## Data Model

### CLI Options

```typescript
interface CLIOptions {
  // 目标路径或 GitHub 仓库
  target: string;
}

interface PromptResults {
  // 模版仓库地址
  templateRepo: string;
  // 包管理器
  packageManager: 'npm' | 'pnpm' | 'bun';
}

interface ExecutionContext {
  // 最终目标目录（绝对路径）
  targetDir: string;
  // 是否是从 GitHub clone
  isGitHubTarget: boolean;
  // 临时目录（用于 clone 模版）
  tempDir: string;
}
```

## Component Structure

### 执行流程

```
┌─────────────────────────────────────────────────────────────┐
│                      CLI Entry (index.ts)                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Parse Arguments (cli.ts)                   │
│              [path] | [github_repo] | [none]                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Run Prompts (prompts.ts)                   │
│         - Template repo URL (default provided)              │
│         - Package manager selection                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Determine Target (utils/path.ts)                │
│         - Is GitHub repo? → clone to temp, then copy        │
│         - Is local path? → prepare target directory         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                Clone Template (actions/clone.ts)             │
│              Clone template repo to temp dir                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Check Conflicts (actions/copy.ts)               │
│         If conflicts exist → prompt user to proceed         │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                Copy Files (actions/copy.ts)                  │
│           Copy template files to target directory           │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Git Init (if needed) (actions/init.ts)          │
│         Initialize git repo if not a cloned GitHub repo     │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│             Install Dependencies (actions/install.ts)        │
│           Run npm/pnpm/bun install in target directory      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      Success Message                         │
│                 Project ready to use!                        │
└─────────────────────────────────────────────────────────────┘
```

## Architecture Patterns

- **Command Pattern**：每个 action 是独立的命令，有明确的输入输出
- **Pipeline Pattern**：按顺序执行多个步骤，每步完成后进入下一步
- **Error Boundary**：每一步都有错误处理，失败时提供清晰的错误信息

## Risks / Trade-offs

### Risk: Git 操作失败

**风险**：用户可能没有 Git 环境，或网络问题导致 clone 失败。

**缓解措施**：
- 在执行前检查 Git 是否可用
- 提供清晰的错误信息和解决建议
- 网络失败时提供重试选项

### Risk: 权限问题

**风险**：目标目录可能没有写入权限。

**缓解措施**：
- 操作前检查目录权限
- 提供清晰的权限错误提示

### Trade-off: 目录级别冲突检测

**决策**：使用目录级别而非文件级别冲突检测。

**影响**：用户无法选择性地保留某些文件，但实现更简单，用户体验更直观。

## Open Questions

1. **Node.js 最低版本要求**
   - 建议要求 Node.js >= 18（LTS）
   - 使用原生 fetch 和 ESM 支持

## Migration Plan

### Steps

1. 安装依赖并配置 TypeScript
2. 实现 CLI 基础结构和参数解析
3. 实现交互式提示
4. 实现 Git 操作和文件复制
5. 实现依赖安装
6. 添加错误处理和美化输出
7. 测试所有场景

### Rollback

- 由于是全新实现，无需回滚计划
- 如需回退，可删除 src 目录并恢复到初始状态

## References

- [commander.js 文档](https://github.com/tj/commander.js)
- [execa 文档](https://github.com/sindresorhus/execa)
- [prompts 文档](https://github.com/terkelg/prompts)
- [create-vite 源码](https://github.com/vitejs/vite/tree/main/packages/create-vite)
