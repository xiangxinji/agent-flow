# 节点 (Nodes)

节点是 AgentFlow 工作流的基本构建块。每个节点代表工作流中的一个执行单元，负责完成特定的任务。

## 节点类型

AgentFlow 支持以下几种核心节点类型：

### 1. Agent 节点

Agent 节点用于与 AI 模型交互，执行智能推理任务。

```typescript
interface IAgentNode {
  id: string
  type: 'agent'
  agent: {
    instructions: string      // Agent 的指令/角色设定
    model: string            // 使用的模型名称
    input: {
      prompt: Input          // 输入提示词
    }
  }
}
```

**示例：**

```json
{
  "id": "ai-assistant",
  "type": "agent",
  "agent": {
    "instructions": "你是一个专业的技术顾问",
    "model": "gpt-4",
    "input": {
      "prompt": {
        "type": "ref",
        "path": "$.userQuestion"
      }
    }
  }
}
```

### 2. Function Call 节点

Function Call 节点用于执行预定义的函数，可以是内置函数或自定义函数。

```typescript
interface IFunctionCallNode {
  id: string
  type: 'function-call'
  function: {
    fnName: string                    // 函数名称
    input: Record<string, Input>      // 函数输入参数
  }
}
```

**示例：**

```json
{
  "id": "fetch-data",
  "type": "function-call",
  "function": {
    "fnName": "utils.fetch",
    "input": {
      "url": {
        "type": "ref",
        "path": "$.apiEndpoint"
      },
      "method": {
        "type": "literal",
        "value": "GET"
      }
    }
  }
}
```

### 3. Branch 节点

Branch 节点用于条件分支，根据条件决定工作流的执行路径。

```typescript
interface IBranchNode {
  id: string
  type: 'branch'
  branch: {
    cases: Array<{
      condition: string    // 条件表达式
      target: string       // 目标节点 ID
    }>
    next?: string         // 默认的下一个节点
  }
}
```

**示例：**

```json
{
  "id": "check-status",
  "type": "branch",
  "branch": {
    "cases": [
      {
        "condition": "$.status === 'success'",
        "target": "success-handler"
      },
      {
        "condition": "$.status === 'error'",
        "target": "error-handler"
      }
    ]
  }
}
```

### 4. Iterator 节点

Iterator 节点用于遍历数组数据，对每个元素执行相同的操作。

```typescript
interface IIteratorNode {
  id: string
  type: 'iterator'
  iterator: {
    array: Input           // 要迭代的数组
    itemKey?: string       // 当前元素的键名（默认 'item'）
    indexKey?: string      // 当前索引的键名（默认 'index'）
    target: string         // 要执行的子节点 ID
    next?: string          // 迭代完成后的下一个节点
    parallel?: boolean     // 是否并行执行
  }
}
```

**示例：**

```json
{
  "id": "process-items",
  "type": "iterator",
  "iterator": {
    "array": {
      "type": "ref",
      "path": "$.items"
    },
    "itemKey": "currentItem",
    "indexKey": "currentIndex",
    "target": "process-single-item",
    "parallel": false
  }
}
```

### 5. Parallel 节点

Parallel 节点用于并行执行多个分支，提高执行效率。

```typescript
interface IParallelNode {
  id: string
  type: 'parallel'
  parallel: {
    branches: Array<string>  // 并行执行的节点 ID 列表
    next?: string           // 所有分支完成后执行的节点
  }
}
```

**示例：**

```json
{
  "id": "parallel-tasks",
  "type": "parallel",
  "parallel": {
    "branches": [
      "task-1",
      "task-2",
      "task-3"
    ],
    "next": "merge-results"
  }
}
```

## 节点通用属性

所有节点都继承自基础节点接口：

```typescript
interface INode {
  id: string                    // 节点唯一标识符
  type: GraphNodeType          // 节点类型
  metadata?: Record<string, any>  // 元数据
  attrs?: Record<string, any>     // 自定义属性
}
```

## 最佳实践

1. **节点 ID 命名**：使用有意义且唯一的标识符，便于调试和维护
2. **合理使用节点类型**：根据业务需求选择合适的节点类型
3. **错误处理**：为关键节点添加错误处理逻辑
4. **性能优化**：对于独立的任务，使用 Parallel 节点并行执行

## 下一步

- 了解 [边 (Edges)](/guide/edges) - 学习如何连接节点
- 探索 [工作流](/guide/workflow) - 理解完整的工作流结构
- 查看 [示例](/examples/) - 从实际案例中学习
