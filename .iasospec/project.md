# create-iaso-analysis 脚手架项目

## 项目概述

一个可通过 `npx create-iaso-analysis` 使用的脚手架 CLI 工具，从 GitHub 模版仓库下载并初始化项目。

## 变更历史

| Change ID | 标题 | 状态 | 创建时间 |
|-----------|------|------|----------|
| implement-scaffold-cli | 实现 create-iaso-analysis 脚手架 CLI | 提案中 | 2026-03-09 |

## 活跃变更

### implement-scaffold-cli

- **proposal.md**: 需求提案文档
- **design.md**: 架构设计文档
- **tasks.md**: 任务拆分文档

**任务列表**:
- T-001: 项目基础架构搭建
- T-002: 命令行参数解析实现 (deps: T-001)
- T-003: 交互式提示实现 (deps: T-001)
- T-004: Git 操作封装 (deps: T-001)
- T-005: 文件操作与冲突处理 (deps: T-001)
- T-006: 依赖安装功能 (deps: T-001)
- T-007: 主流程整合与输出美化 (deps: T-002, T-003, T-004, T-005, T-006)
- T-008: 测试与文档完善 (deps: T-007)

## 技术栈

- **运行时**: Node.js >= 18
- **语言**: TypeScript
- **CLI 库**: commander, prompts, execa, picocolors
- **模块格式**: ESM
