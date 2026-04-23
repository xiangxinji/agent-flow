# Frontend App Proposal

## Why

当前项目缺少可视化工作流编辑界面，用户只能通过 JSON 配置文件来定义工作流，这导致：
1. **配置复杂**: 手动编写 JSON 配置容易出错且难以维护
2. **可视化缺失**: 无法直观地查看和编辑工作流结构
3. **开发效率低**: 缺少图形化工具降低了开发效率

添加一个基于 VueFlow 的前端可视化编辑器，可以让用户通过拖拽节点、连接边的方式来设计和编辑工作流，极大提升开发体验和效率。

## What Changes

### 新增功能
- 创建独立的 `app` 目录，包含完整的前端项目
- 使用 Vite 作为构建工具，提供快速的开发体验
- 使用 Vue 3 + TypeScript 开发现代化的前端应用
- 集成 VueFlow 库，实现工作流可视化编辑功能
- 支持所有现有节点类型的可视化编辑（agent, branch, iterator, parallel, tool, intent-recognition）
- 提供节点配置面板，支持可视化配置节点参数
- 支持工作流的导入导出功能（JSON 格式）
- 实时预览工作流结构

### 技术栈
- **构建工具**: Vite
- **前端框架**: Vue 3
- **开发语言**: TypeScript
- **工作流可视化**: VueFlow
- **UI 组件库**: 可选（如 Element Plus, Ant Design Vue 等）
- **状态管理**: Pinia
- **路由**: Vue Router

## Capabilities

### New Capabilities
- `frontend-app`: 前端应用基础架构，包括 Vite 配置、Vue 3 项目结构、TypeScript 配置
- `workflow-visual-editor`: 工作流可视化编辑器，基于 VueFlow 实现节点拖拽、连接、配置功能
- `node-configuration-panel`: 节点配置面板，支持不同节点类型的参数配置
- `workflow-import-export`: 工作流导入导出功能，支持 JSON 格式

### Modified Capabilities
无现有能力需要修改

## Impact

### 代码影响
- 新增 `app/` 目录，包含完整的前端项目
- 不影响现有 `src/` 目录的代码
- 前端项目独立构建和部署

### 依赖影响
- 新增前端项目依赖：Vue 3, Vite, TypeScript, VueFlow 等
- 不影响现有后端依赖

### 构建影响
- 前端项目独立构建流程
- 可选：添加根目录的构建脚本，统一构建前后端

### 部署影响
- 前端项目可独立部署
- 支持静态文件部署（如 Nginx, Vercel 等）
- 可选：与后端 API 集成部署

### 向后兼容性
- 完全向后兼容，不影响现有功能
- 前端项目为新增功能，可选使用
