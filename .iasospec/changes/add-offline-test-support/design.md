## Context

当前 `create-iaso-analysis` CLI 只支持从 GitHub clone 模版仓库，无法在离线环境下使用和测试。需要添加离线模式支持，允许使用本地目录作为模版源。

## Goals / Non-Goals

### Goals

- 支持 `--offline` 参数，使用本地模版目录
- 提供自动化脚本创建测试模版
- 测试产物不入 Git

### Non-Goals

- 不实现模版缓存机制
- 不支持部分离线（混合模式）

## Decisions

### 1. 离线模式参数设计

**决策**：使用 `--offline` 布尔参数 + 可选的 `--template` 路径参数

```bash
# 使用默认本地测试模版
npx create-iaso-analysis --offline my-project

# 指定本地模版路径
npx create-iaso-analysis --offline --template ./my-template my-project
```

**理由**：
- 简单直观，易于理解
- `--template` 可选，默认使用 `test/template`
- 与其他 CLI 工具设计模式一致

### 2. 测试模版结构

**决策**：在 `test/template/` 下创建最小化模版

```
test/template/
├── package.json      # 基本信息
├── README.md         # 说明文档
├── .gitignore        # Git 忽略规则
└── src/
    └── index.ts      # 入口文件
```

**理由**：
- 足够验证 CLI 的复制和安装功能
- 不包含多余文件，创建快速
- 易于维护和扩展

### 3. 主流程修改

**决策**：在 `src/index.ts` 中根据 `offline` 标志分支处理

```typescript
// 伪代码
if (options.offline) {
  tempDir = options.template || path.join(projectRoot, 'test/template');
  validateLocalTemplate(tempDir);
} else {
  tempDir = await cloneTemplate(templateRepo);
}
```

**理由**：
- 最小化代码改动
- 保持现有流程不变
- 易于测试和维护

## Component Structure

### 修改后的执行流程

```
┌─────────────────────────────────────────────────────────────┐
│                      CLI Entry (index.ts)                    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Parse Arguments (cli.ts)                   │
│         [target] + [--offline] + [--template path]          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
                    ┌─────┴─────┐
                    │  offline? │
                    └─────┬─────┘
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
    ┌─────────────────┐     ┌─────────────────┐
    │ Use Local       │     │ Clone from      │
    │ Template Dir    │     │ GitHub          │
    └────────┬────────┘     └────────┬────────┘
              │                       │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │ Copy Template Files   │
              │ ... (rest of flow)    │
              └───────────────────────┘
```

## Risks / Trade-offs

### Risk: 本地模版路径错误

**风险**：用户可能指定错误的本地路径

**缓解措施**：
- 添加路径验证，提供清晰的错误信息
- 自动将相对路径转换为绝对路径

### Trade-off: 不支持远程模版缓存

**决策**：离线模式仅支持本地目录，不实现远程模版的本地缓存

**影响**：用户需要手动维护本地模版，但实现更简单

## Migration Plan

### Steps

1. 修改 `src/cli.ts` 添加新参数
2. 修改 `src/index.ts` 添加离线分支逻辑
3. 修改 `src/prompts.ts` 支持离线默认值
4. 创建 `scripts/` 目录和测试脚本
5. 更新 `.gitignore` 和 `package.json`

### Rollback

- 删除 `--offline` 相关代码
- 删除 `scripts/` 目录中的测试脚本
- 移除 `test/` 相关的 npm scripts
