# Tasks: implement-scaffold-cli

## 任务概览

| Task ID | 标题 | 依赖 |
|---------|------|------|
| T-001 | 项目基础架构搭建 | - |
| T-002 | 命令行参数解析实现 | T-001 |
| T-003 | 交互式提示实现 | T-001 |
| T-004 | Git 操作封装 | T-001 |
| T-005 | 文件操作与冲突处理 | T-001 |
| T-006 | 依赖安装功能 | T-001 |
| T-007 | 主流程整合与输出美化 | T-002, T-003, T-004, T-005, T-006 |
| T-008 | 测试与文档完善 | T-007 |

---

# T-001 项目基础架构搭建

## 需求描述

搭建 CLI 项目的基础架构，包括 TypeScript 配置、npm 包配置、项目目录结构和基础工具函数。

**需求类型**：Infrastructure

**涉及领域**：全栈（CLI 工具）

具体实现要求：
1. 配置 TypeScript 编译环境，支持 ESM 输出
2. 配置 package.json，设置 bin 入口和必要字段
3. 创建项目目录结构
4. 实现日志输出工具（带颜色）
5. 配置开发依赖

## 相关指引

**其他:**
- Node.js >= 18 支持
- 使用 ESM 模块格式

## 注意点

- 确保 `#!/usr/bin/env node` shebang 正确设置
- TypeScript 配置需要输出 ESM 格式
- 需要配置 `bin` 字段以支持 npx 调用

## Scenario

### Scenario 1: 开发环境验证

**场景描述：**
开发者 clone 项目后，能够正确安装依赖并进行开发。

- 前置条件：Node.js >= 18 已安装
- 操作步骤：`npm install` -> `npm run build`
- 预期结果：项目能够成功编译，无类型错误

## Checklist

- [x] C-001 配置 tsconfig.json，支持 ESM 输出，target ES2022
- [x] C-002 配置 package.json，添加 type: "module"，设置 bin 入口
- [x] C-003 创建 src 目录结构（index.ts, cli.ts, prompts.ts, actions/, utils/, types.ts）
- [x] C-004 实现基础 logger 工具（info, success, error, warn 方法，带颜色）
- [x] C-005 安装必要依赖：typescript, tsx, commander, prompts, execa, picocolors, fs-extra
- [x] C-006 添加 npm scripts：build, dev

---

# T-002 命令行参数解析实现

## 需求描述

实现命令行参数解析功能，识别用户输入的是本地路径还是 GitHub 仓库地址。

**需求类型**：Feature

**涉及领域**：全栈（CLI 工具）

具体实现要求：
1. 解析位置参数 `[target]`
2. 实现 GitHub 仓库识别逻辑：
   - 以 `http://` 或 `https://` 开头
   - 以 `git@` 开头
   - 匹配 `owner/repo` 模式（包含 `/` 但不以 `.` 或 `/` 开头）
3. 路径处理：支持相对路径、绝对路径、`.`（当前目录）
4. 将 GitHub 短格式（`owner/repo`）转换为完整 SSH 地址

## 相关指引

**其他:**
- 参考 create-vite 的参数解析实现

## 注意点

- Windows 路径处理（如 `C:\path`）
- 相对路径需要转换为绝对路径
- GitHub 仓库短格式需要补全为完整地址

## Scenario

### Scenario 1: 解析本地路径

**场景描述：**
用户输入 `npx create-iaso-analysis ./my-project`，正确识别为本地路径。

- 前置条件：无
- 操作步骤：CLI 接收参数 `./my-project`
- 预期结果：识别为本地路径，targetDir 为 `$(pwd)/my-project` 的绝对路径

### Scenario 2: 解析 GitHub 仓库

**场景描述：**
用户输入 `npx create-iaso-analysis IASO-AI/my-repo`，正确识别为 GitHub 仓库。

- 前置条件：无
- 操作步骤：CLI 接收参数 `IASO-AI/my-repo`
- 预期结果：识别为 GitHub 仓库，repoUrl 为 `git@github.com:IASO-AI/my-repo.git`

## Checklist

- [x] C-001 实现 isGitHubRepo 函数，正确识别 GitHub 仓库格式
- [x] C-002 实现 parseTarget 函数，返回 { type: 'path' | 'github', value: string }
- [x] C-003 实现 toAbsolutePath 函数，将相对路径转换为绝对路径
- [x] C-004 实现 normalizeGitHubUrl 函数，将短格式转换为完整 SSH 地址
- [x] C-005 集成 commander 解析位置参数

---

# T-003 交互式提示实现

## 需求描述

实现 CLI 交互式提示功能，收集模版仓库地址和包管理器选择。

**需求类型**：Feature

**涉及领域**：全栈（CLI 工具）

具体实现要求：
1. 模版仓库地址提示：
   - 默认值：`git@github.com:IASO-AI/iaso-analysis-template.git`
   - 用户可修改
2. 包管理器选择：
   - 选项：npm / pnpm / bun
   - 单选列表形式
3. 优雅的提示界面

## 相关指引

**其他:**
- 使用 prompts 或 @inquirer/prompts 库

## 注意点

- 提示信息需要清晰明确
- 默认值需要高亮显示
- 支持 Ctrl+C 取消操作

## Scenario

### Scenario 1: 使用默认模版仓库

**场景描述：**
用户直接按 Enter 使用默认模版仓库。

- 前置条件：CLI 启动
- 操作步骤：显示模版仓库提示 -> 用户按 Enter
- 预期结果：使用默认值 `git@github.com:IASO-AI/iaso-analysis-template.git`

### Scenario 2: 选择包管理器

**场景描述：**
用户选择 pnpm 作为包管理器。

- 前置条件：模版仓库已确认
- 操作步骤：显示包管理器选项 -> 用户选择 pnpm
- 预期结果：packageManager 为 `pnpm`

## Checklist

- [x] C-001 实现 promptTemplateRepo 函数，带默认值
- [x] C-002 实现 promptPackageManager 函数，提供 npm/pnpm/bun 选项
- [x] C-003 实现 runPrompts 函数，整合所有提示
- [x] C-004 处理用户取消操作（Ctrl+C）
- [x] C-005 提示信息清晰，有适当的颜色和格式

---

# T-004 Git 操作封装

## 需求描述

封装 Git 相关操作，包括 clone 仓库和初始化新仓库。

**需求类型**：Feature

**涉及领域**：全栈（CLI 工具）

具体实现要求：
1. cloneTemplate：clone 模版仓库到临时目录
2. cloneTarget：clone 目标 GitHub 仓库（如果目标是 GitHub）
3. gitInit：在目标目录初始化 Git 仓库
4. 清理临时目录
5. Git 可用性检查

## 相关指引

**其他:**
- 使用 execa 执行 git 命令
- 使用 fs-extra 处理临时目录

## 注意点

- clone 失败时需要清理临时目录
- 需要处理 SSH 认证失败的情况
- 临时目录命名需要唯一性

## Scenario

### Scenario 1: Clone 模版仓库

**场景描述：**
用户确认模版仓库后，clone 到临时目录。

- 前置条件：Git 可用，网络正常
- 操作步骤：调用 cloneTemplate
- 预期结果：模版仓库 clone 到临时目录，返回临时目录路径

### Scenario 2: Clone 失败处理

**场景描述：**
模版仓库地址错误或网络问题，clone 失败。

- 前置条件：网络异常或仓库不存在
- 操作步骤：调用 cloneTemplate
- 预期结果：抛出错误，提示用户检查仓库地址和网络

## Checklist

- [x] C-001 实现 checkGitAvailable 函数，检查 Git 是否安装
- [x] C-002 实现 cloneTemplate 函数，clone 模版到临时目录
- [x] C-003 实现 cloneTarget 函数，clone 目标 GitHub 仓库
- [x] C-004 实现 gitInit 函数，初始化 Git 仓库
- [x] C-005 实现 cleanup 函数，清理临时目录
- [x] C-006 错误处理：网络错误、认证错误、仓库不存在

---

# T-005 文件操作与冲突处理

## 需求描述

实现文件复制和冲突检测功能。

**需求类型**：Feature

**涉及领域**：全栈（CLI 工具）

具体实现要求：
1. 检测目标目录是否非空
2. 检测模版文件与目标目录文件冲突
3. 冲突时提示用户选择：覆盖全部 / 取消
4. 复制模版文件到目标目录
5. 排除 `.git` 目录

## 相关指引

**其他:**
- 使用 fs-extra 进行文件操作
- 使用 prompts 进行冲突确认

## 注意点

- 复制时排除 `.git` 目录
- 保持文件权限
- 处理符号链接

## Scenario

### Scenario 1: 目标目录为空

**场景描述：**
目标目录不存在或为空，直接复制。

- 前置条件：目标目录为空
- 操作步骤：调用 copyTemplate
- 预期结果：直接复制所有文件，无冲突提示

### Scenario 2: 目标目录有冲突

**场景描述：**
目标目录已存在同名文件，提示用户。

- 前置条件：目标目录非空且存在同名文件
- 操作步骤：调用 copyTemplate -> 检测冲突 -> 提示用户
- 预期结果：显示冲突提示，用户选择覆盖或取消

## Checklist

- [x] C-001 实现 isDirectoryEmpty 函数，检测目录是否为空
- [x] C-002 实现 detectConflicts 函数，检测文件冲突
- [x] C-003 实现 promptOverwrite 函数，确认是否覆盖
- [x] C-004 实现 copyTemplateFiles 函数，复制文件（排除 .git）
- [x] C-005 处理取消操作，不进行任何修改

---

# T-006 依赖安装功能

## 需求描述

实现根据用户选择的包管理器自动安装依赖的功能。

**需求类型**：Feature

**涉及领域**：全栈（CLI 工具）

具体实现要求：
1. 检测目标目录是否有 package.json
2. 根据用户选择执行对应的安装命令：
   - npm: `npm install`
   - pnpm: `pnpm install`
   - bun: `bun install`
3. 显示安装进度
4. 处理安装失败

## 相关指引

**其他:**
- 使用 execa 执行安装命令

## 注意点

- 需要检测包管理器是否安装
- 安装失败时提供清晰的错误信息
- 如果没有 package.json 则跳过安装

## Scenario

### Scenario 1: 使用 pnpm 安装依赖

**场景描述：**
用户选择 pnpm，执行依赖安装。

- 前置条件：目标目录有 package.json，pnpm 已安装
- 操作步骤：调用 installDependencies('pnpm')
- 预期结果：执行 `pnpm install`，显示进度，安装成功

### Scenario 2: 没有 package.json

**场景描述：**
目标目录没有 package.json，跳过安装。

- 前置条件：目标目录没有 package.json
- 操作步骤：调用 installDependencies
- 预期结果：跳过安装，显示提示信息

## Checklist

- [x] C-001 实现 hasPackageJson 函数，检测 package.json
- [x] C-002 实现 checkPackageManagerAvailable 函数，检测包管理器
- [x] C-003 实现 installDependencies 函数，执行安装命令
- [x] C-004 显示安装进度信息
- [x] C-005 处理安装失败，提供重试建议

---

# T-007 主流程整合与输出美化

## 需求描述

整合所有功能模块，实现完整的 CLI 主流程，并美化输出。

**需求类型**：Feature

**涉及领域**：全栈（CLI 工具）

具体实现要求：
1. 整合主流程：
   - 解析参数 -> 交互提示 -> 准备目标目录 -> clone 模版 -> 复制文件 -> git init -> 安装依赖
2. 美化输出：
   - 步骤进度显示
   - 成功/失败图标
   - 最终成功信息（包含下一步指引）
3. 错误处理：
   - 全局错误捕获
   - 友好的错误信息

## 相关指引

**其他:**
- 参考 create-vite 的输出风格

## 注意点

- 确保错误时清理临时文件
- 提供清晰的下一步指引
- 处理所有可能的异常

## Scenario

### Scenario 1: 完整流程执行

**场景描述：**
用户运行 `npx create-iaso-analysis my-project`，完成所有步骤。

- 前置条件：Git 和 Node.js 已安装
- 操作步骤：
  1. 显示欢迎信息
  2. 提示输入模版仓库（用户按 Enter 使用默认）
  3. 提示选择包管理器（用户选择 pnpm）
  4. Clone 模版到临时目录
  5. 复制文件到 ./my-project
  6. Git init
  7. pnpm install
  8. 显示成功信息和下一步指引
- 预期结果：项目创建成功，依赖已安装

### Scenario 2: 流程中断处理

**场景描述：**
用户在提示阶段按 Ctrl+C 取消。

- 前置条件：无
- 操作步骤：显示包管理器提示 -> 用户按 Ctrl+C
- 鵆预期结果：显示取消信息，退出程序，不产生任何文件

## Checklist

- [x] C-001 实现主流程函数 run，整合所有步骤
- [x] C-002 实现步骤进度显示（✓ 成功，✗ 失败，○ 进行中）
- [x] C-003 实现欢迎信息输出
- [x] C-004 实现成功完成信息（包含 cd 路径、启动命令等）
- [x] C-005 实现全局错误处理和临时文件清理
- [x] C-006 处理用户中断信号（SIGINT）

---

# T-008 测试与文档完善

## 需求描述

进行完整的功能测试，完善 README 文档。

**需求类型**：Enhancement

**涉及领域**：全栈（CLI 工具）

具体实现要求：
1. 测试所有场景：
   - 新目录创建
   - 当前目录创建
   - GitHub 仓库创建
2. 测试边界情况：
   - 路径不存在
   - 无权限
   - 网络错误
3. 编写 README.md：
   - 安装说明
   - 使用方法
   - 选项说明

## 相关指引

**其他:**
- 测试不同操作系统（macOS、Linux、Windows）

## 注意点

- 测试时使用测试用的模版仓库
- 注意不同操作系统的路径差异

## Scenario

### Scenario 1: 新目录创建测试

**场景描述：**
测试在新目录创建项目的完整流程。

- 前置条件：目标目录不存在
- 操作步骤：`npx create-iaso-analysis test-project`
- 预期结果：test-project 目录创建成功，包含所有模版文件

## Checklist

- [x] C-001 测试 `npx create-iaso-analysis <name>` 场景
- [x] C-002 测试 `npx create-iaso-analysis .` 场景
- [x] C-003 测试 `npx create-iaso-analysis <github-repo>` 场景
- [x] C-004 测试冲突检测和覆盖确认
- [x] C-005 测试错误处理（网络错误、权限错误）
- [x] C-006 编写 README.md 文档
