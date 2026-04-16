# API 概览

AgentFlow 提供了完整的 TypeScript API，让您可以编程方式创建和管理复杂的工作流。

## 核心模块

### 节点接口

定义工作流中各种节点的数据结构：

- [节点接口](/api/node-interfaces) - 所有节点类型的完整接口定义
- [输入类型](/api/node-interfaces#输入类型) - 定义节点的输入数据来源

### 执行器

负责执行各种类型的节点：

- [执行器 API](/api/executor-api) - 执行器的接口和实现
- [自定义执行器](/api/executor-api#自定义执行器) - 创建自己的执行器

### 工作流引擎

核心引擎，负责工作流的调度和执行：

- [工作流引擎](/api/workflow-engine) - 引擎的核心功能和使用方法
- [状态管理](/api/workflow-engine#状态管理) - 工作流状态的管理和追踪

## 快速开始

### 基本用法

```typescript
import { WorkflowEngine } from 'agentflow'

const workflow = {
  id: 'my-workflow',
  name: 'My Workflow',
  version: '1.0.0',
  nodes: [
    // 定义节点...
  ],
  edges: [
    // 定义边...
  ],
  root: 'start-node'
}

const engine = new WorkflowEngine()
const result = await engine.execute(workflow, {
  // 输入数据
})
```

### 类型安全

AgentFlow 完全使用 TypeScript 编写，提供完整的类型定义：

```typescript
import type { 
  IFlow, 
  IAgentNode, 
  IFunctionCallNode,
  IBranchNode,
  IIteratorNode,
  IParallelNode 
} from 'agentflow'
```

## 架构概览

```
┌─────────────────────────────────────────┐
│           WorkflowEngine                │
│  ┌─────────────────────────────────┐   │
│  │         GraphBuilder            │   │
│  │  ┌─────────────────────────┐   │   │
│  │  │      NodeFactory        │   │   │
│  │  └─────────────────────────┘   │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │       ExecutorFactory           │   │
│  │  ┌─────────────────────────┐   │   │
│  │  │   BaseExecutor          │   │   │
│  │  │   ├── AgentExecutor     │   │   │
│  │  │   ├── FunctionExecutor  │   │   │
│  │  │   └── ...               │   │   │
│  │  └─────────────────────────┘   │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │       StateEngine               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 核心概念

### 工作流 (Flow)

工作流是节点和边的集合，定义了完整的业务流程。

### 节点 (Node)

节点是工作流的执行单元，每个节点负责完成特定的任务。

### 边 (Edge)

边定义了节点之间的连接关系，决定了工作流的执行顺序。

### 执行器 (Executor)

执行器负责执行特定类型的节点，处理节点的输入输出。

### 状态 (State)

状态管理器追踪工作流的执行状态，存储节点间的数据流转。

## 下一步

- [节点接口](/api/node-interfaces) - 查看所有节点类型的详细定义
- [执行器 API](/api/executor-api) - 了解执行器的工作原理
- [工作流引擎](/api/workflow-engine) - 深入理解引擎的核心功能
