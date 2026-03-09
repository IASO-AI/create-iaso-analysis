# Tasks: add-offline-test-support

## 任务概览

| Task ID | 标题 | 依赖 |
|---------|------|------|
| T-001 | --offline 参数与本地模版支持 | - |
| T-002 | 测试模版创建与清理脚本 | T-001 |

---

# T-001 --offline 参数与本地模版支持

## 需求描述

为 CLI 添加 `--offline` 参数支持，当使用此参数时，将模版路径视为本地目录，直接复制文件而不是通过 git clone。

**需求类型**：Feature

**涉及领域**：全栈（CLI 工具）

具体实现要求：
1. 在 commander 中添加 `--offline` 选项
2. 当 `--offline` 为 true 时：
   - 将 `templateRepo` 视为本地路径
   - 跳过 `cloneTemplate` 调用
   - 直接使用本地目录作为模版源
3. 验证本地模版目录是否存在
4. 更新交互式提示的默认值（离线模式下默认使用本地测试模版路径）

## 相关指引

**其他:**
- 修改 `src/cli.ts` 添加 `--offline` 参数
- 修改 `src/index.ts` 主流程，根据 offline 标志跳过 clone
- 修改 `src/prompts.ts` 支持离线模式下的默认值

## 注意点

- 本地模版路径需要转换为绝对路径
- 需要验证目录存在且非空
- 离线模式下不应检查网络连接

## Scenario

### Scenario 1: 使用 --offline 参数

**场景描述：**
用户在离线环境下使用本地模版创建项目。

- 前置条件：本地模版目录存在（如 `test/template`）
- 操作步骤：`npx create-iaso-analysis --offline my-project`
- 预期结果：直接从本地模版复制文件，不执行 git clone

### Scenario 2: 离线模式下模版路径不存在

**场景描述：**
用户指定了不存在的本地模版路径。

- 前置条件：模版路径不存在
- 操作步骤：`npx create-iaso-analysis --offline --template ./not-exist my-project`
- 预期结果：显示错误信息，提示模版目录不存在

## Checklist

- [x] C-001 在 `src/cli.ts` 添加 `--offline` boolean 选项
- [x] C-002 在 `src/cli.ts` 添加 `--template` 字符串选项（可选，指定本地模版路径）
- [x] C-003 修改 `src/index.ts`，离线模式下跳过 cloneTemplate
- [x] C-004 添加 `validateLocalTemplate` 函数验证本地模版目录
- [x] C-005 修改 `src/prompts.ts`，离线模式下使用本地模版路径作为默认值
- [x] C-006 更新类型定义，添加 offline 和 template 选项

---

# T-002 测试模版创建与清理脚本

## 需求描述

创建自动化脚本来生成和清理测试模版目录，方便开发和测试。

**需求类型**：Infrastructure

**涉及领域**：全栈（CLI 工具）

具体实现要求：
1. 创建 `scripts/setup-test-template.ts` 脚本：
   - 在 `test/template/` 目录下创建最小化的模版文件
   - 包含：`package.json`、`README.md`、`src/index.ts`、`.gitignore`
2. 创建 `scripts/cleanup-test.ts` 脚本：
   - 删除 `test/` 目录下所有内容
3. 添加 npm scripts：`test:setup`、`test:cleanup`
4. 更新 `.gitignore`，添加 `test/` 目录

## 相关指引

**其他:**
- 使用 tsx 运行 TypeScript 脚本
- 使用 fs-extra 进行文件操作

## 注意点

- 测试模版应该是真实模版的简化版本
- 清理脚本需要安全处理，避免误删
- Windows 和 Unix 路径兼容

## Scenario

### Scenario 1: 创建测试模版

**场景描述：**
开发者运行测试准备脚本。

- 前置条件：无
- 操作步骤：`npm run test:setup`
- 预期结果：`test/template/` 目录创建成功，包含基本的模版文件

### Scenario 2: 清理测试产物

**场景描述：**
测试完成后清理测试目录。

- 前置条件：`test/` 目录存在
- 操作步骤：`npm run test:cleanup`
- 预期结果：`test/` 目录被删除

## Checklist

- [x] C-001 创建 `scripts/setup-test-template.ts` 脚本
- [x] C-002 脚本创建 `test/template/package.json`（包含 name、scripts）
- [x] C-003 脚本创建 `test/template/README.md`
- [x] C-004 脚本创建 `test/template/src/index.ts`
- [x] C-005 脚本创建 `test/template/.gitignore`
- [x] C-006 创建 `scripts/cleanup-test.ts` 脚本
- [x] C-007 添加 npm scripts：`test:setup`、`test:cleanup`
- [x] C-008 更新 `.gitignore`，添加 `test/` 目录
