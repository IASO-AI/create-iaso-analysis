# Proposal: 实现 create-iaso-analysis 脚手架 CLI

## 需求摘要

创建一个可通过 `npx create-iaso-analysis` 使用的脚手架工具，从 GitHub 模版仓库下载并初始化项目。

## 背景与动机

为了提高项目初始化效率，需要一个标准化的脚手架工具，让开发者能够快速从模版仓库创建新项目。该工具需要支持：

1. 在本地任意路径创建项目
2. 从 GitHub 仓库 clone 后再添加模版文件
3. 灵活选择包管理工具

当前缺少这样的标准化工具，开发者需要手动 clone 模版、复制文件、初始化项目，效率较低。

## 目标与成功标准

- 用户可通过 `npx create-iaso-analysis` 一键创建项目
- 支持多种目标路径场景（当前目录、新目录、GitHub 仓库）
- 自动安装依赖，开箱即用

**成功标准**：
- `npx create-iaso-analysis example` 能在 `./example` 创建完整项目
- `npx create-iaso-analysis .` 能在当前目录创建项目
- `npx create-iaso-analysis user/repo` 能 clone 仓库并添加模版文件

## 范围与边界

### In Scope（本次包含）

- 命令行参数解析（path / github_repo）
- 交互式提示（模版仓库地址、包管理器选择）
- Git 操作（clone、init）
- 文件复制与冲突检测
- 依赖自动安装

### Out of Scope（本次不包含）

- 模版变量替换功能 — 保持简单，模版文件直接复制
- 子目录模版 — 仅支持仓库根目录作为模版
- 离线模式 — 需要网络连接

## 用户/系统场景

### 场景 1：在新目录创建项目

- **谁**：开发者
- **何时/条件**：需要创建新的分析项目
- **做什么**：运行 `npx create-iaso-analysis my-project`
- **得到什么**：在 `./my-project` 目录下创建完整项目，依赖已安装，Git 已初始化

### 场景 2：在当前目录创建项目

- **谁**：开发者
- **何时/条件**：已在空目录中，想直接在此创建项目
- **做什么**：运行 `npx create-iaso-analysis .`
- **得到什么**：当前目录下创建项目文件

### 场景 3：从 GitHub 仓库创建

- **谁**：开发者
- **何时/条件**：需要在现有 GitHub 仓库基础上添加模版
- **做什么**：运行 `npx create-iaso-analysis IASO-AI/my-existing-repo`
- **得到什么**：clone 指定仓库后，添加模版文件（如有冲突会提示）

## 约束与假设

### 约束

- 需要 Git 环境
- 需要网络连接（下载模版、clone 仓库）
- 需要安装选择的包管理器（npm/pnpm/bun）

### 假设

- 模版仓库使用 SSH 地址（git@github.com:...）
- 用户已配置 SSH key 或 Git 凭据
- 目标路径的父目录已存在

## 名词与术语

| 术语/缩写 | 含义 | 备注 |
|----------|------|------|
| 模版仓库 | 存放项目模版文件的 GitHub 仓库 | 默认为 iaso-analysis-template |
| 目标路径 | 项目创建的位置 | 可以是本地路径或 GitHub 仓库 |
| 冲突 | 目标目录已存在同名文件 | 采用目录级别检测 |

## 参考与链接

- 类似工具：create-vite、create-next-app
- 默认模版仓库：git@github.com:IASO-AI/iaso-analysis-template.git
