# API 参考

本节提供 AgentFlow 的完整 API 参考文档。

## 核心接口

### 节点接口

#### INode

所有节点的基础接口。

```typescript
interface INode {
  id: string
  type: GraphNodeType
  metadata?: Record<string, any>
  attrs?: Record<string, any>
}
```

**属性说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | 是 | 节点的唯一标识符 |
| `type` | `GraphNodeType` | 是 | 节点类型 |
| `metadata` | `Record<string, any>` | 否 | 节点元数据 |
| `attrs` | `Record<string, any>` | 否 | 自定义属性 |

---

#### IAgentNode

Agent 节点接口，用于 AI 模型交互。

```typescript
interface IAgentNode extends INode {
  agent: {
    instructions: string
    model: string
    input: {
      prompt: Input
    }
  }
}
```

**属性说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `agent.instructions` | `string` | 是 | Agent 的角色设定和指令 |
| `agent.model` | `string` | 是 | 使用的 AI 模型名称 |
| `agent.input.prompt` | `Input` | 是 | 输入提示词配置 |

---

#### IFunctionCallNode

Function Call 节点接口，用于执行函数。

```typescript
interface IFunctionCallNode extends INode {
  function: {
    fnName: string
    input: Record<string, Input>
  }
}
```

**属性说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `function.fnName` | `string` | 是 | 要调用的函数名称 |
| `function.input` | `Record<string, Input>` | 是 | 函数输入参数映射 |

---

#### IBranchNode

Branch 节点接口，用于条件分支。

```typescript
interface IBranchNode extends INode {
  branch: {
    cases: Array<{
      condition: string
      target: string
    }>
    next?: string
  }
}
```

**属性说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `branch.cases` | `Array` | 是 | 条件分支列表 |
| `branch.cases[].condition` | `string` | 是 | 条件表达式 |
| `branch.cases[].target` | `string` | 是 | 目标节点 ID |
| `branch.next` | `string` | 否 | 默认的下一个节点 |

---

#### IIteratorNode

Iterator 节点接口，用于遍历数组。

```typescript
interface IIteratorNode extends INode {
  iterator: {
    array: Input
    itemKey?: string
    indexKey?: string
    target: string
    next?: string
    parallel?: boolean
  }
}
```

**属性说明：**

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `iterator.array` | `Input` | 是 | - | 要迭代的数组数据源 |
| `iterator.itemKey` | `string` | 否 | `'item'` | 当前元素存储键名 |
| `iterator.indexKey` | `string` | 否 | `'index'` | 当前索引存储键名 |
| `iterator.target` | `string` | 是 | - | 要迭代的子节点 ID |
| `iterator.next` | `string` | 否 | - | 迭代完成后的下一个节点 |
| `iterator.parallel` | `boolean` | 否 | `false` | 是否并行处理 |

---

#### IParallelNode

Parallel 节点接口，用于并行执行。

```typescript
interface IParallelNode extends INode {
  parallel: {
    branches: Array<string>
    next?: string
  }
}
```

**属性说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `parallel.branches` | `Array<string>` | 是 | 并行执行的节点 ID 列表 |
| `parallel.next` | `string` | 否 | 所有分支完成后执行的节点 |

---

### 边接口

#### IEdge

定义节点之间的连接关系。

```typescript
interface IEdge {
  from: string
  to: string
}
```

**属性说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `from` | `string` | 是 | 源节点 ID |
| `to` | `string` | 是 | 目标节点 ID |

---

### 工作流接口

#### IFlow

完整的工作流定义。

```typescript
interface IFlow {
  id: string
  name: string
  version: string
  nodes: INode[]
  edges: IEdge[]
  root: string
}
```

**属性说明：**

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | `string` | 是 | 工作流唯一标识符 |
| `name` | `string` | 是 | 工作流名称 |
| `version` | `string` | 是 | 工作流版本 |
| `nodes` | `INode[]` | 是 | 节点列表 |
| `edges` | `IEdge[]` | 是 | 边列表 |
| `root` | `string` | 是 | 根节点 ID |

---

### 输入类型

#### Input

定义节点的输入数据来源。

```typescript
type InputType = 'literal' | 'ref' | 'template'

interface Input {
  type: InputType
  // 根据 type 不同，包含不同的属性
}
```

**类型说明：**

| 类型 | 说明 | 示例 |
|------|------|------|
| `literal` | 字面量值 | `{ "type": "literal", "value": "hello" }` |
| `ref` | 引用其他节点的输出 | `{ "type": "ref", "path": "$.nodeId.output" }` |
| `template` | 模板字符串 | `{ "type": "template", "template": "Hello ${name}" }` |

---

## 类型定义

### GraphNodeType

节点类型枚举。

```typescript
type GraphNodeType = 'agent' | 'branch' | 'iterator' | 'parallel' | 'function-call'
```

---

## 下一步

- 查看 [执行器 API](/api/executor-api) 了解执行器接口
- 了解 [工作流引擎](/api/workflow-engine) 的核心功能
- 浏览 [示例](/examples/) 查看实际应用场景
