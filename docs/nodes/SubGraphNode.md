# SubGraphNode 设计说明与使用指南

## 🎯 设计理念

你的 `clone()` 方法设计非常正确！它为 SubGraphNode 提供了完美的状态隔离机制：

### ✅ 为什么 clone() 方法是关键

1. **状态隔离**: 每个子工作流都有独立的状态空间
2. **并发安全**: 多个子工作流可以并行运行而不会互相干扰
3. **资源复用**: 共享 history 和 event 实例，但保持状态独立
4. **内存效率**: 避免复制整个工作流定义，只复制状态

## 🏗️ 架构设计

### 核心执行流程

```typescript
// 1. 获取子工作流定义
const subWorkflow = await this.getSubWorkflow(ctx);

// 2. 解析输入参数映射
const subWorkflowInput = this.resolveInputMapping(ctx);

// 3. 创建独立的引擎实例 - 利用你预留的 clone() 方法！
const subEngine = ctx.engine.clone();

// 4. 处理状态继承（可选）
if (this.subgraph.inheritState) {
    // 复制父工作流的状态
}

// 5. 运行子工作流
const subWorkflowResult = await subEngine.run(subWorkflowInput);

// 6. 处理输出结果映射
const mappedResult = this.resolveOutputMapping(subWorkflowResult);
```

### 关键特性

#### 1. 输入映射 (Input Mapping)
```json
{
  "inputMapping": {
    "userId": { "type": "ref", "path": "fetch-main-data.userId" },
    "userName": { "type": "ref", "path": "fetch-main-data.userName" },
    "timestamp": { "type": "literal", "value": "2024-01-01T00:00:00Z" }
  }
}
```

#### 2. 输出映射 (Output Mapping)
```json
{
  "outputMapping": {
    "processedResult": "result.summary",
    "userScore": "result.score"
  }
}
```

#### 3. 状态继承 (State Inheritance)
```json
{
  "inheritState": false  // true: 继承父状态, false: 独立状态
}
```

#### 4. 错误处理 (Error Handling)
```json
{
  "onError": "continue"  // "continue": 继续执行, "stop": 停止执行
}
```

## 📋 接口定义

```typescript
export interface ISubGraphNode extends INode {
    subgraph: {
        workflowId: string;        // 子工作流的 ID
        inputMapping?: Record<string, Input>;  // 输入参数映射
        outputMapping?: Record<string, string>; // 输出结果映射
        next?: string;             // 子工作流完成后的下一个节点
        inheritState?: boolean;    // 是否继承父工作流的状态（默认 false）
        onError?: 'continue' | 'stop'; // 错误处理策略
    }
}
```

## 🚀 使用示例

### 基本用法

```json
{
  "id": "call-user-workflow",
  "type": "subgraph",
  "subgraph": {
    "workflowId": "user-processing-workflow",
    "inputMapping": {
      "userId": { "type": "ref", "path": "fetch-data.userId" }
    },
    "outputMapping": {
      "result": "output.summary"
    },
    "next": "next-step"
  }
}
```

### 状态继承模式

```json
{
  "id": "inherit-state-example",
  "type": "subgraph",
  "subgraph": {
    "workflowId": "child-workflow",
    "inheritState": true,  // 子工作流可以访问父工作流的所有状态
    "inputMapping": {
      "additionalParam": { "type": "literal", "value": "extra" }
    }
  }
}
```

### 错误容错模式

```json
{
  "id": "error-tolerant-subgraph",
  "type": "subgraph",
  "subgraph": {
    "workflowId": "risky-workflow",
    "onError": "continue",  // 即使失败也继续执行
    "next": "cleanup-step"
  }
}
```

## 🔄 执行流程详解

### 1. 工作流注册表集成

```typescript
// 在 WorkflowEngine 中添加工作流注册表
engine.workflowRegistry = new WorkflowRegistry();
engine.workflowRegistry.registerWorkflow('user-workflow', userWorkflowDef);

// SubGraphNode 会自动查找并执行
```

### 2. 状态管理

```typescript
// 父工作流状态
parentState = {
  '$': { initialData },
  'node-1': { output: 'result1' },
  'node-2': { output: 'result2' }
}

// 子工作流状态（独立）
childState = {
  '$': { mappedInput },  // 映射后的输入
  'sub-node-1': { output: 'subresult1' }
}

// 父工作流可以访问子工作流的结果
parentState['subgraph-node'] = {
  workflowId: 'child-workflow',
  mappedOutput: { finalResult }
}
```

### 3. 嵌套支持

```typescript
// 支持多层嵌套的子工作流
MainWorkflow
  └── SubGraph1
      └── SubGraph2
          └── SubGraph3
```

## 🛡️ 最佳实践

### 1. 工作流设计
- **单一职责**: 每个子工作流应该只处理一个明确的业务逻辑
- **接口明确**: 清晰定义输入输出映射
- **错误处理**: 根据业务需求选择合适的错误处理策略

### 2. 性能考虑
- **避免过度嵌套**: 深层嵌套会影响性能和调试
- **状态继承谨慎使用**: 状态继承会增加耦合度
- **并行执行**: 利用 clone() 方法实现子工作流并行执行

### 3. 调试技巧
```typescript
// 监控子工作流执行
engine.event.on('WORKFLOW-RUNNING', (workflowId) => {
  console.log(`Sub-workflow ${workflowId} started`);
});

// 检查状态传递
console.log('Parent state:', ctx.state.getAll());
console.log('Child input:', subWorkflowInput);
console.log('Child output:', subWorkflowResult);
```

## 🎓 总结

你的 `clone()` 方法设计为 SubGraphNode 提供了：

1. **完美的状态隔离**: 每个子工作流都有独立的状态空间
2. **高效的资源利用**: 共享配置，独立状态
3. **灵活的数据传递**: 支持输入输出映射
4. **强大的扩展性**: 支持嵌套和并行执行

这个设计完全符合微服务架构的理念，为工作流引擎提供了强大的模块化能力！
