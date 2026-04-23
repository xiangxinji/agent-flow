# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

这是一个 DAG（有向无环图）工作流引擎，提供类似 Dify/n8n 的可视化工作流编排功能。该系统集成了 Mastra 框架用于 agent 执行，并提供三层架构：路由器 → 规划器 → 执行器。

## 开发命令

- `npm run dev` - 使用 ts-node 在开发模式下运行
- `npm run build` - 将 TypeScript 编译到 dist/ 目录
- `npm run start:app` - 启动前端应用
- `npm run start:server` - 启动 HTTP API 服务器（默认端口 3000）


## 架构

### 核心组件

1. **DSL 层** (`src/interface/graph/`)
   - 定义 Flow DSL 结构，包含节点和边
   - 节点类型：`agent`、`branch`、`iterator`、`parallel`、`subgraph`、`function-call`
   - 支持的输入类型：`literal`（字面量）、`ref`（节点输出引用）、`template`（模板）

2. **工作流核心** (`src/core/workflow/`)
   - `Workflow` 类：节点的容器，包含工作流元数据
   - `BaseNode`：所有节点类型的抽象基类
   - 节点实现：`ExecutorNode`、`BranchNode`、`ParallelNode`、`IteratorNode`、`SubGraphNode`
   - `ExecutorRuntime`：节点执行的上下文提供者

3. **图构建器** (`src/core/graph/builder.ts`)
   - 将 Flow DSL 转换为 Workflow 实例
   - 处理节点之间的边映射
   - 特殊处理并行节点和分支节点的连接

4. **工作流引擎** (`src/workflow-engine/`)
   - `WorkflowEngine`：运行工作流的主执行引擎
   - `EngineStateManager`：状态管理器，使用 `'$'` 作为根状态键
   - `EventManager`：工作流生命周期的事件驱动架构
   - `WorkflowHistory`：可选的执行历史跟踪

5. **工厂模式** (`src/core/factory/`)
   - `NodeFactory`：从 DSL 定义创建节点实例
   - `ExecutorFactory`：创建执行器实例（agent、function-call）

6. **函数注册表** (`src/function/`)
   - `FunctionRegistry`：可执行函数的注册表
   - 内置函数：`to-json`、`log`、`fetch`
   - 可通过注册新的 `ExecutorFunction` 实例来扩展

### 数据流架构

1. **输入解析**：节点使用点标记法引用先前节点的输出（例如 `nodeId.path.to.value`）
2. **状态管理**：
   - 根输入存储在 `'$'` 键下
   - 节点输出存储在其节点 ID 下
   - 状态是不可变的（使用 lodash.cloneDeep）
3. **输入类型**：
   - `literal`：固定值
   - `ref`：对其他节点输出的引用
   - `template`：带 `${nodeId.path}` 变量插值的字符串模板

### 执行模型

引擎支持：
- **顺序执行**：标准的节点到节点流程
- **并行执行**：通过 `Promise.all` 并发执行多个分支
- **分支执行**：基于表达式求值的条件路由
- **事件系统**：在关键生命周期阶段发出事件（初始化、运行中、完成等）

### 集成点

- **Mastra 框架**：通过 `@mastra/core` 用于 agent 执行
- **HTTP API**：基于 Hono 的 REST API 用于工作流执行
- **环境配置**：使用 dotenv 进行配置（PORT 变量）

## 关键模式

### 添加新节点类型

1. 在 `src/interface/graph/graph.ts` 中定义节点接口
2. 在 `src/core/workflow/node/` 中创建扩展 `BaseNode` 的节点类
3. 将节点类型添加到 `src/core/workflow/node/base.ts` 的 `NodeType` 联合类型中
4. 在 `NodeFactory.create()` 中注册节点

### 添加新函数

1. 从 `src/function/base.ts` 扩展 `ExecutorFunction`
2. 实现 `execute()` 方法
3. 在 `FunctionRegistry` 构造函数中注册

### 节点中的状态访问

使用 `EngineStateGetter.getInput()` 从状态中解析输入。该函数处理：
- 字面量值
- 对其他节点输出的引用（`{ type: 'ref', path: 'nodeId.path' }`）
- 带变量插值的模板字符串

## 重要说明

- 根状态键是 `'$'` - 所有工作流输入都存储在这里
- 节点输出自动存储在其节点 ID 下的状态中
- 分支条件使用 `ConditionParser` 进行表达式求值
- 系统使用深拷贝来防止状态突变
- 可通过 `engine.event.on(stage, callback)` 附加事件监听器
