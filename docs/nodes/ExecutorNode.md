# ExecutorNode 执行器节点

## 概述

ExecutorNode 是工作流引擎中最基础的节点类型，用于执行单一任务。它包含一个执行器（Executor）实例，可以执行各种类型的任务，如 AI 智能体调用、函数调用等。

## 节点特性

- **单一任务执行**: 每个节点执行一个具体的任务
- **类型安全**: 基于输入输出 schema 的强类型执行
- **状态管理**: 自动将执行结果存储到工作流状态中
- **链式调用**: 支持通过 `next` 属性连接到下一个节点

## 接口定义

```typescript
// Agent 节点
export interface IAgentNode extends INode {
    config: {
        instructions: string    // AI 智能体的指令
        input: {
            prompt: Input       // 输入提示词
        }
    }
}

// Function Call 节点
export interface IFunctionCallNode extends INode {
    config: {
        fnName: string          // 函数名称
        input: Record<string, Input>  // 函数输入参数
    }
}
```

## 使用示例

### 1. Agent 节点示例

```json
{
  "id": "ai-agent",
  "type": "agent",
  "config": {
    "instructions": "你是一个专业的客服助手，请友好地回应用户问题",
    "input": {
      "prompt": {
        "type": "ref",
        "path": "user-query.text"
      }
    }
  }
}
```

### 2. Function Call 节点示例

```json
{
  "id": "calculate-tax",
  "type": "function-call",
  "config": {
    "fnName": "calculateTax",
    "input": {
      "amount": { "type": "ref", "path": "order.amount" },
      "rate": { "type": "literal", "value": 0.1 },
      "region": { "type": "ref", "path": "user.region" }
    }
  }
}
```

## 输入类型

ExecutorNode 支持三种输入类型：

### 1. Literal (字面量)
```json
{
  "apiKey": { "type": "literal", "value": "sk-1234567890" }
}
```

### 2. Ref (引用)
```json
{
  "userId": { "type": "ref", "path": "previous-node.userId" }
}
```

### 3. Template (模板)
```json
{
  "message": {
    "type": "template",
    "template": "Hello ${user.name}, your order ${order.id} is ready"
  }
}
```

## 执行流程

```typescript
// 1. 解析输入参数
const input = EngineStateGetter.getInput(state, node.config.input);

// 2. 调用执行器
const executor = ExecutorFactory.create(node.type, node);
const output = await executor.execute(node, runtime);

// 3. 存储结果到状态
state.setState(node.id, { output });

// 4. 执行下一个节点（如果有）
if (node.next) {
    await engine.runNode(node.next);
}
```

## 状态管理

### 输入状态访问
```typescript
// 访问根输入
const rootInput = state.getState('$');

// 访问其他节点输出
const previousOutput = state.getState('previous-node-id');

// 访问嵌套属性
const user = state.getState('fetch-user').user;
```

### 输出状态存储
```typescript
// 节点执行后，结果存储在节点 ID 下
state.setState('current-node-id', {
    output: result,
    timestamp: new Date().toISOString()
});
```

## 错误处理

ExecutorNode 内置了错误处理机制：

```typescript
try {
    const result = await executor.execute(node, runtime);
    return { success: true, result };
} catch (error) {
    return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
    };
}
```

## 扩展开发

### 创建自定义执行器

```typescript
import { BaseExecutor } from '@/core/workflow/executor/base';

export class CustomExecutor extends BaseExecutor {
    async execute(node: ExecutorNode, runtime: ExecutorRuntime) {
        // 1. 解析输入参数
        const input = runtime.getInput(node.config.input);

        // 2. 执行自定义逻辑
        const result = await this.performCustomTask(input);

        // 3. 返回结果
        return result;
    }

    private async performCustomTask(input: any) {
        // 自定义业务逻辑
    }
}

// 注册执行器
ExecutorFactory.register('custom', CustomExecutor);
```

## 性能考虑

- **缓存**: 对于重复执行的任务，考虑实现结果缓存
- **超时**: 为长时间运行的任务设置超时限制
- **重试**: 对于可能失败的任务，实现自动重试机制
- **并发**: 注意控制并发执行的数量

## 最佳实践

1. **单一职责**: 每个执行器节点只负责一个明确的任务
2. **输入验证**: 在执行前验证输入参数的有效性
3. **错误处理**: 提供清晰的错误信息和恢复策略
4. **日志记录**: 记录重要的执行信息用于调试
5. **性能监控**: 监控执行时间和资源使用

## 相关组件

- [BaseExecutor](../core/Executor.md): 执行器基类
- [ExecutorFactory](../core/ExecutorFactory.md): 执行器工厂
- [FunctionRegistry](../core/FunctionRegistry.md): 函数注册表

## 示例工作流

完整的示例工作流请参考：
- [Agent 节点示例](../../examples/mocks/agent-example.json)
- [Function Call 节点示例](../../examples/mocks/function-call-example.json)
- [测试脚本](../../examples/tests/test-executor.ts)
