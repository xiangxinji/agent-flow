# Frontend App Design

## Context

### Current State
- 项目当前只有后端工作流引擎，缺少前端可视化界面
- 用户通过手动编写 JSON 配置文件来定义工作流
- 存在多种节点类型：agent, branch, iterator, parallel, function-call, intent-recognition
- 工作流配置存储在 `examples/mocks/` 目录中

### Technical Context
- 后端使用 TypeScript + Node.js + Hono
- 工作流引擎已实现完整的节点执行逻辑
- 存在完整的状态管理和执行器系统
- 项目使用 pnpm 作为包管理器

### Constraints
- 前端项目必须独立于后端代码
- 不影响现有后端功能
- 需要与现有 JSON 配置格式兼容
- 支持所有现有节点类型

## Goals / Non-Goals

### Goals
- 创建独立的前端项目结构
- 实现基于 VueFlow 的工作流可视化编辑器
- 支持所有现有节点类型的可视化编辑
- 提供节点配置面板，支持参数配置
- 支持工作流的导入导出（JSON 格式）
- 提供良好的开发体验（热重载、TypeScript 支持）

### Non-Goals
- 不实现后端 API 集成（仅前端界面）
- 不实现工作流执行功能（仅编辑和配置）
- 不实现用户认证和权限管理
- 不实现工作流版本控制
- 不实现实时协作功能

## Decisions

### 1. 项目结构

**Decision**: 在项目根目录创建独立的 `app` 目录

**Rationale**: 
- 前后端代码完全分离，便于独立开发和部署
- 不影响现有后端代码结构
- 符合现代前后端分离架构

**Alternatives Considered**: 
- 在 `src` 目录下添加前端代码：会增加项目复杂度，不利于独立部署
- 创建独立仓库：会增加维护成本，不便于统一管理

### 2. 技术栈选择

**Decision**: 使用 Vite + Vue 3 + TypeScript + VueFlow

**Rationale**: 
- **Vite**: 快速的开发服务器和构建工具，优秀的开发体验
- **Vue 3**: 现代化的响应式框架，Composition API 提供更好的代码组织
- **TypeScript**: 类型安全，与后端技术栈一致
- **VueFlow**: 专门用于工作流可视化的库，功能完善

**Alternatives Considered**: 
- React + ReactFlow: 团队更熟悉 Vue 生态
- Webpack: Vite 更快，配置更简单
- JavaScript: TypeScript 提供更好的类型安全和开发体验

### 3. 状态管理

**Decision**: 使用 Pinia 进行状态管理

**Rationale**: 
- Vue 3 官方推荐的状态管理库
- 更好的 TypeScript 支持
- 简洁的 API 设计

**Alternatives Considered**: 
- Vuex: Pinia 更现代化，API 更简洁
- 不使用状态管理: 对于复杂应用，状态管理是必要的

### 4. UI 组件库

**Decision**: 暂不使用 UI 组件库，使用原生 HTML/CSS

**Rationale**: 
- VueFlow 已经提供了节点和边的可视化组件
- 减少依赖，保持项目轻量
- 便于自定义样式

**Alternatives Considered**: 
- Element Plus: 功能完善，但可能过于重量级
- Ant Design Vue: 同样较为重量级

### 5. 节点类型设计

**Decision**: 为每种节点类型创建独立的 Vue 组件

**Rationale**: 
- 每种节点类型有不同的配置需求
- 便于维护和扩展
- 支持自定义节点样式

**Alternatives Considered**: 
- 通用节点组件: 难以处理不同节点类型的特殊需求

### 6. 数据流设计

**Decision**: 使用 JSON 格式作为工作流数据格式

**Rationale**: 
- 与现有配置格式完全兼容
- 便于导入导出
- 易于调试和版本控制

**Alternatives Considered**: 
- 自定义格式: 会增加转换成本，不利于兼容性

## Risks / Trade-offs

### 1. 学习曲线

**Risk**: 团队可能不熟悉 VueFlow 和 Vue 3

**Mitigation**: 
- 提供详细的文档和示例
- 使用 Vue 3 Composition API，代码更易理解
- VueFlow 官方文档完善

### 2. 性能问题

**Risk**: 大型工作流可能导致性能问题

**Mitigation**: 
- 实现虚拟滚动
- 限制节点数量
- 优化渲染性能

### 3. 浏览器兼容性

**Risk**: VueFlow 可能不支持旧版浏览器

**Mitigation**: 
- 明确浏览器支持范围
- 使用 Babel 进行转译
- 提供 polyfill

### 4. 数据一致性

**Risk**: 前端编辑的工作流可能与后端执行逻辑不一致

**Mitigation**: 
- 使用 TypeScript 共享类型定义
- 实现严格的类型检查
- 提供配置验证功能

### 5. 维护成本

**Risk**: 前端项目增加了维护成本

**Mitigation**: 
- 使用 TypeScript 提高代码质量
- 编写单元测试
- 保持代码结构清晰

## Migration Plan

### Implementation Steps
1. **项目初始化**: 创建 Vite + Vue 3 + TypeScript 项目
2. **安装依赖**: 安装 VueFlow, Pinia, Vue Router 等
3. **项目结构**: 创建目录结构（components, views, stores, types 等）
4. **基础组件**: 实现基础布局和导航
5. **节点组件**: 为每种节点类型创建可视化组件
6. **配置面板**: 实现节点配置面板
7. **导入导出**: 实现 JSON 导入导出功能
8. **测试**: 编写单元测试和集成测试
9. **文档**: 编写用户文档和开发文档

### Rollback Strategy
- 删除 `app` 目录
- 移除根目录中与前端相关的构建脚本
- 更新项目文档，移除前端相关内容

## Open Questions

1. **UI 组件库**: 是否需要引入 UI 组件库？如果需要，选择哪个？
2. **主题系统**: 是否需要实现主题切换功能？
3. **快捷键**: 是否需要支持快捷键操作？
4. **撤销重做**: 是否需要实现撤销重做功能？
5. **节点搜索**: 是否需要实现节点搜索功能？
6. **工作流模板**: 是否需要提供工作流模板？
7. **实时预览**: 是否需要实现工作流实时预览功能？
8. **API 集成**: 未来如何与后端 API 集成？
