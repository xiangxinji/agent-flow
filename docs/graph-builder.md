# GraphBuilder 使用文档

工业级 DAG Workflow Engine 的完整实现，基于 README 规范构建。

## 功能特性

✅ **核心功能**
- 从 Flow DSL 构建 DAG 图结构
- 拓扑排序与循环检测
- 分支识别与条件执行
- 并行节点识别与执行
- Schema 校验与连接验证
- 完整的执行引擎（支持重试、超时、日志）

✅ **设计原则**
- Engine 控制流程（控制流）
- Step 控制计算（数据流）
- Workflow 不参与（避免声明式限制）
- Graph → Plan → Execution（分层）

## 快速开始

### 1. 基本用法

```typescript
import {
  GraphBuilder,
  ExecutionEngine,
  Flow,
  StepDefinition
} from './src/core/graph';

// 定义 Flow DSL
const flow: Flow = {
  nodes: [
    { id: 'start', type: 'trigger', config: { input: { message: 'Hello' } } },
    { id: 'process', type: 'processor' },
    { id: 'end', type: 'finalizer' }
  ],
  edges: [
    { from: 'start', to: 'process' },
    { from: 'process', to: 'end' }
  ]
};

// 定义步骤实现
const stepRegistry: Record<string, StepDefinition> = {
  trigger: {
    execute: async (input) => ({ timestamp: Date.now(), message: input.message })
  },
  processor: {
    execute: async (input) => ({ processed: true })
  },
  finalizer: {
    execute: async (input) => ({ finished: true })
  }
};

// 构建图并执行
const graph = GraphBuilder.buildGraph(flow);
const engine = new ExecutionEngine(stepRegistry);
const result = await engine.execute(graph);
```

### 2. 条件分支

```typescript
const conditionalFlow: Flow = {
  nodes: [
    { id: 'input', type: 'inputProcessor' },
    { id: 'decision', type: 'decisionMaker' },
    { id: 'successPath', type: 'successHandler' },
    { id: 'errorPath', type: 'errorHandler' }
  ],
  edges: [
    { from: 'input', to: 'decision' },
    { from: 'decision', to: 'successPath', condition: 'eq(status, "success")' },
    { from: 'decision', to: 'errorPath', condition: 'eq(status, "error")' }
  ]
};
```

### 3. 并行执行

```typescript
const parallelFlow: Flow = {
  nodes: [
    { id: 'start', type: 'starter' },
    { id: 'task1', type: 'parallelTask1' },
    { id: 'task2', type: 'parallelTask2' },
    { id: 'task3', type: 'parallelTask3' },
    { id: 'end', type: 'finisher' }
  ],
  edges: [
    { from: 'start', to: 'task1' },
    { from: 'start', to: 'task2' },
    { from: 'start', to: 'task3' },
    { from: 'task1', to: 'end' },
    { from: 'task2', to: 'end' },
    { from: 'task3', to: 'end' }
  ]
};
```

## API 文档

### GraphBuilder

#### `buildGraph(flow: Flow): Graph`
从 Flow DSL 构建图结构。

#### `topologicalSort(graph: Graph): GraphNode[]`
拓扑排序，返回执行顺序，会检测循环依赖。

#### `buildExecutionPlan(graph: Graph): ExecutionPlan`
构建执行计划，识别 step、parallel、branch 执行单元。

#### `validateGraph(graph: Graph): Validation`
验证图结构，检测孤立节点、无效连接等问题。

#### `getGraphStats(flow: Flow): GraphStats`
获取图统计信息（节点数、边数、入口/出口点等）。

### ExecutionEngine

#### `constructor(stepRegistry: StepRegistry, options?: ExecutionOptions)`
创建执行引擎实例。

```typescript
interface ExecutionOptions {
  timeout?: number;        // 单个节点超时时间（毫秒）
  retries?: number;        // 失败重试次数
  enableLogging?: boolean; // 是否启用日志
  onNodeComplete?: (result) => void;  // 节点完成回调
  onNodeError?: (nodeId, error) => void; // 节点错误回调
}
```

#### `execute(graph: Graph, initialContext?: Context): Promise<ExecutionResult>`
执行工作流，返回执行结果。

### SchemaValidator

#### `validateConnection(fromNode, toNode, stepRegistry): ConnectionValidation`
验证两个节点之间的连接是否兼容。

#### `validateGraphConnections(graph, stepRegistry): ValidationResult`
验证图中所有连接的 Schema 兼容性。

#### `generateSchema(data): SchemaDefinition`
从示例数据生成 Schema 定义。

## 数据结构

### Flow DSL
```typescript
interface Flow {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

interface FlowNode {
  id: string;
  type: string;
  config?: Record<string, any>;
}

interface FlowEdge {
  from: string;
  to: string;
  condition?: string;
}
```

### Execution Plan
```typescript
type ExecutionUnit =
  | { type: 'step'; node: GraphNode }
  | { type: 'parallel'; nodes: GraphNode[] }
  | { type: 'branch'; node: GraphNode; branches: FlowEdge[] };

type ExecutionPlan = ExecutionUnit[];
```

### Context
```typescript
type Context = {
  [nodeId: string]: any;
};
```

## 高级功能

### 1. JSONPath 表达式

支持在节点配置中使用 JSONPath 引用其他节点的输出：

```typescript
{
  id: 'process',
  type: 'processor',
  config: {
    input: {
      data: '$.previousNode.output',
      timestamp: '$.startNode.timestamp'
    }
  }
}
```

### 2. 条件表达式

支持在分支中使用条件表达式：

```typescript
// 支持的操作符
eq(a, b)   // 等于
ne(a, b)   // 不等于
gt(a, b)   // 大于
lt(a, b)   // 小于
gte(a, b)  // 大于等于
lte(a, b)  // 小于等于
contains(arr, item) // 包含

// 示例
{ from: 'decision', to: 'success', condition: 'eq(status, "success")' }
{ from: 'decision', to: 'retry', condition: 'lt(attempts, 3)' }
```

### 3. 重试与超时

```typescript
const engine = new ExecutionEngine(stepRegistry, {
  timeout: 30000,    // 30秒超时
  retries: 3,        // 失败重试3次
  enableLogging: true,
  onNodeComplete: (result) => {
    console.log(`${result.nodeId} completed in ${result.endTime - result.startTime}ms`);
  }
});
```

### 4. Schema 验证

```typescript
// 定义步骤的输入输出 Schema
const stepRegistry = {
  myStep: {
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        count: { type: 'number' }
      },
      required: ['message']
    },
    outputSchema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        result: { type: 'string' }
      }
    },
    execute: async (input) => {
      // 这里的 input 已经被 inputSchema 验证
      return { success: true, result: 'ok' };
    }
  }
};

// 验证连接
const validation = SchemaValidator.validateConnection(
  fromNode, toNode, stepRegistry
);
if (!validation.valid) {
  console.error('Connection errors:', validation.errors);
}
```

## 示例代码

完整的使用示例请参考：
- [examples/graph-builder-example.ts](../examples/graph-builder-example.ts) - 完整功能演示
- [tests/graph/builder.test.ts](../tests/graph/builder.test.ts) - 单元测试

## 架构设计

```
[ UI Editor ]
      ↓
[ Flow DSL JSON ]
      ↓
[ Graph Builder ] ← 构建图结构
      ↓
[ Execution Planner ] ← 生成执行计划
      ↓
[ DAG Engine ] ← 执行控制流
      ↓
[ Step Runtime ] ← 执行数据流
```

## 扩展能力

### 已实现
- ✅ DAG 调度系统
- ✅ 类型安全执行单元
- ✅ 重试机制
- ✅ 超时控制
- ✅ 日志系统
- ✅ Schema 校验

### 建议实现
- 🔄 UI Schema 自动生成
- 🔄 调试工具（execution trace）
- 🔄 循环支持（loop）
- 🔄 子工作流调用
- 🔄 持久化和状态恢复

## 核心价值

- **可扩展**: 易于添加新的节点类型和执行策略
- **类型安全**: 基于 Schema 的强类型校验
- **高可控**: 精确控制执行流程和数据流
- **工业级**: 完整的错误处理、重试、超时机制
