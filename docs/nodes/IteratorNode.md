# IteratorNode 使用说明

## 概述

IteratorNode 是一个强大的工作流节点，用于实现数组迭代和批量处理功能。它允许你遍历一个数组，并对数组中的每个元素执行指定的子节点。

## 主要特性

- **顺序/并行处理**: 支持顺序迭代或并行处理数组元素
- **灵活的数据源**: 支持从字面量、节点引用获取数组数据
- **状态管理**: 自动管理迭代过程中的元素和索引状态
- **错误处理**: 内置错误捕获和结果统计功能
- **结果收集**: 自动收集每次迭代的结果并生成统计报告

## 接口定义

```typescript
export interface IIteratorNode extends INode {
    iterator: {
        array: Input;              // 要迭代的数组数据源
        itemKey?: string;          // 当前元素存储键名，默认 'item'
        indexKey?: string;         // 当前索引存储键名，默认 'index'
        target: string;            // 要迭代的子节点 ID
        next?: string;             // 迭代完成后的下一个节点
        parallel?: boolean;        // 是否并行处理（默认 false）
    }
}
```

## 使用示例

### 1. 基本用法

```json
{
  "id": "process-users",
  "type": "iterator",
  "iterator": {
    "array": { "type": "ref", "path": "fetch-users.users" },
    "itemKey": "user",
    "indexKey": "userIndex",
    "target": "send-email",
    "next": "generate-report"
  }
}
```

### 2. 并行处理

```json
{
  "id": "parallel-process",
  "type": "iterator",
  "iterator": {
    "array": { "type": "literal", "value": [1, 2, 3, 4, 5] },
    "target": "process-item",
    "parallel": true
  }
}
```

### 3. 在子节点中访问迭代数据

```json
{
  "id": "send-email",
  "type": "function-call",
  "config": {
    "fnName": "sendEmail",
    "input": {
      "to": { "type": "ref", "path": "$user.email" },
      "userName": { "type": "ref", "path": "$user.name" },
      "currentIndex": { "type": "ref", "path": "$userIndex" }
    }
  }
}
```

## 运行测试

1. 确保已安装依赖：
```bash
npm install
```

2. 构建项目：
```bash
npm run build
```

3. 运行测试示例：
```bash
npm run dev -- examples/test-iterator.ts
```

## 输出结果

IteratorNode 执行完成后会在状态中存储以下结果：

```typescript
{
  total: 5,              // 总迭代次数
  successful: 4,         // 成功次数
  failed: 1,            // 失败次数
  results: [            // 详细结果数组
    {
      index: 0,
      success: true,
      result: { /* 节点执行结果 */ }
    },
    // ...
  ]
}
```

## 高级用法

### 条件中断

在某些情况下，你可能希望在遇到错误时立即中断迭代。可以在 `IteratorNode` 的实现中取消注释以下行：

```typescript
// throw error; // 取消注释以在第一个错误时中断
```

### 自定义错误处理

你可以在子节点中实现自己的错误处理逻辑，并通过返回特定的结果来控制迭代流程。

### 性能优化建议

1. **大数据集**: 对于大型数组，考虑使用分页处理
2. **并行限制**: 在并行模式下，注意控制并发数量
3. **内存管理**: 及时清理不再需要的临时数据

## 注意事项

1. **数组验证**: IteratorNode 会验证数据源是否为数组类型
2. **状态隔离**: 并行模式下，每次迭代都有独立的状态副本
3. **结果收集**: 所有迭代结果都会被收集，注意内存使用
4. **循环引用**: 避免在迭代目标节点中创建循环引用

## 扩展性

IteratorNode 设计为可扩展的，你可以：

1. 继承 `IteratorNode` 实现自定义迭代逻辑
2. 重写 `resolveIteratorArray` 方法支持复杂数据源
3. 实现自定义的迭代策略（如跳过、过滤等）

## 相关组件

- `EngineStateManager`: 状态管理器，提供迭代数据存储
- `FunctionRegistry`: 函数注册表，用于注册迭代调用的函数
- `WorkflowEngine`: 工作流引擎，协调整个迭代流程
