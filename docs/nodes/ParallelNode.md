# ParallelNode 并行节点

## 概述

ParallelNode 实现并行执行逻辑，允许工作流同时执行多个独立的任务分支。它类似于编程语言中的 Promise.all，但以可视化方式配置，可以显著提高工作流的执行效率。

## 节点特性

- **并行执行**: 同时执行多个独立的任务分支
- **结果聚合**: 等待所有分支完成后再继续
- **性能提升**: 充分利用系统资源，减少总执行时间
- **状态隔离**: 每个分支有独立的状态空间
- **错误处理**: 可以处理部分分支失败的情况

## 接口定义

```typescript
export interface IParallelNode extends INode {
    branches: Array<string>;  // 并行执行的分支节点 ID 列表
    next?: string;            // 所有分支完成后的下一个节点
}
```

## 使用示例

### 1. 基础并行执行

```json
{
  "id": "parallel-data-fetch",
  "type": "parallel",
  "branches": [
    "fetch-user-profile",
    "fetch-user-orders",
    "fetch-user-recommendations"
  ],
  "next": "aggregate-user-data"
}
```

### 2. 并行数据处理

```json
{
  "id": "parallel-processing",
  "type": "parallel",
  "branches": [
    "process-image",
    "process-metadata",
    "generate-thumbnail"
  ],
  "next": "merge-results"
}
```

### 3. 并行 API 调用

```json
{
  "id": "parallel-api-calls",
  "type": "parallel",
  "branches": [
    "call-payment-service",
    "call-inventory-service",
    "call-shipping-service"
  ],
  "next": "finalize-order"
}
```

## 执行流程

```typescript
// 1. 并行执行所有分支
const results = await Promise.all(
    this.branches.map(async (branch) => {
        return await engine.runNode(branch);
    })
);

// 2. 聚合结果
const aggregatedResult = {
    totalBranches: this.branches.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results: results
};

// 3. 存储结果到状态
state.setState(this.id, aggregatedResult);

// 4. 执行下一个节点
if (this.next) {
    await engine.runNode(this.next);
}
```

## 状态管理

### 执行前状态
```typescript
{
    "$": { inputData: "value" },
    "previous-node": { result: "data" }
}
```

### 执行中状态
```typescript
// 每个分支节点独立存储自己的结果
{
    "fetch-user-profile": {
        profile: { name: "John", email: "john@example.com" }
    },
    "fetch-user-orders": {
        orders: [{ id: 1, amount: 100 }]
    },
    "fetch-user-recommendations": {
        recommendations: ["item1", "item2"]
    }
}
```

### 执行后状态
```typescript
{
    "parallel-data-fetch": {
        totalBranches: 3,
        successful: 3,
        failed: 0,
        results: [
            { branchId: "fetch-user-profile", success: true },
            { branchId: "fetch-user-orders", success: true },
            { branchId: "fetch-user-recommendations", success: true }
        ]
    }
}
```

## 错误处理

### 默认行为（任何分支失败则整体失败）
```typescript
try {
    const results = await Promise.all(
        this.branches.map(branch => engine.runNode(branch))
    );
} catch (error) {
    // 任何一个分支失败都会立即抛出错误
    console.error('Parallel execution failed:', error);
    throw error;
}
```

### 容错模式（继续执行所有分支）
```typescript
const results = await Promise.all(
    this.branches.map(async (branch) => {
        try {
            const result = await engine.runNode(branch);
            return { branch, success: true, result };
        } catch (error) {
            return { branch, success: false, error: error.message };
        }
    })
);

// 检查是否有失败的分支
const failedBranches = results.filter(r => !r.success);
if (failedBranches.length > 0) {
    console.warn('Some branches failed:', failedBranches);
    // 可以选择继续或抛出错误
}
```

## 性能优化

### 1. 并发控制
```typescript
// 对于大量分支，限制并发数量
import pLimit from 'p-limit';

const limit = pLimit(5); // 最多同时执行 5 个分支
const results = await Promise.all(
    this.branches.map(branch =>
        limit(() => engine.runNode(branch))
    )
);
```

### 2. 超时控制
```typescript
// 为每个分支设置超时
const timeout = (promise, ms) =>
    Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), ms)
        )
    ]);

const results = await Promise.all(
    this.branches.map(branch =>
        timeout(engine.runNode(branch), 30000) // 30秒超时
    )
);
```

### 3. 资源优化
```typescript
// 避免过多的并行分支导致资源耗尽
const MAX_PARALLEL = 10;
if (this.branches.length > MAX_PARALLEL) {
    console.warn('Too many parallel branches, consider batch processing');
}
```

## 最佳实践

### 1. 分支独立性
```json
// ✅ 好的设计：分支之间相互独立
{
  "branches": [
    "fetch-user-data",
    "fetch-product-data",
    "fetch-config-data"
  ]
}

// ❌ 避免：分支之间有依赖关系
{
  "branches": [
    "step-one",
    "step-two",  // 依赖 step-one 的结果
    "step-three" // 依赖 step-two 的结果
  ]
}
```

### 2. 错误处理
```json
// ✅ 为并行执行添加错误处理
{
  "id": "parallel-with-error-handling",
  "branches": ["task-1", "task-2", "task-3"],
  "next": "check-results"
}
// 在 check-results 节点中检查结果
```

### 3. 资源合理分配
```json
// ✅ 根据系统资源合理设置并行数量
{
  "id": "controlled-parallelism",
  "branches": ["task-1", "task-2", "task-3", "task-4"],
  "metadata": {
    "maxConcurrency": 4,
    "timeout": 30000
  }
}
```

## 高级用法

### 1. 条件并行执行
```json
// 根据条件动态决定哪些分支需要执行
{
  "id": "conditional-parallel",
  "type": "branch",
  "cases": [
    {
      "condition": "$.mode === 'full'",
      "target": "parallel-full-mode"
    },
    {
      "condition": "$.mode === 'quick'",
      "target": "parallel-quick-mode"
    }
  ]
}
```

### 2. 分批并行处理
```json
// 对于大量数据，分批并行处理
{
  "id": "batch-parallel-processing",
  "type": "iterator",
  "iterator": {
    "array": { "type": "ref", "path": "large-dataset.batches" },
    "target": "parallel-batch-processor",
    "next": "merge-all-batches"
  }
}
```

### 3. 结果聚合模式
```json
// 并行执行后的结果聚合
{
  "id": "parallel-with-aggregation",
  "branches": [
    "calculate-sum",
    "calculate-average",
    "calculate-max",
    "calculate-min"
  ],
  "next": "aggregate-statistics"
}
```

## 实际应用场景

### 1. 微服务调用
```json
{
  "id": "microservices-orchestration",
  "branches": [
    "call-user-service",
    "call-order-service",
    "call-payment-service",
    "call-inventory-service"
  ],
  "next": "compose-response"
}
```

### 2. 数据处理管道
```json
{
  "id": "data-processing-pipeline",
  "branches": [
    "validate-data",
    "transform-data",
    "enrich-data",
    "index-data"
  ],
  "next": "save-processed-data"
}
```

### 3. 多渠道通知
```json
{
  "id": "multi-channel-notification",
  "branches": [
    "send-email-notification",
    "send-sms-notification",
    "send-push-notification",
    "send-webhook-notification"
  ],
  "next": "log-notification-results"
}
```

## 监控和调试

### 1. 执行时间监控
```typescript
const startTime = Date.now();
const results = await Promise.all(/* ... */);
const duration = Date.now() - startTime;
console.log(`Parallel execution took ${duration}ms`);
```

### 2. 分支状态跟踪
```typescript
const branchStatus = this.branches.map(branch => ({
    branch,
    status: 'running',
    startTime: new Date().toISOString()
}));

// 更新状态
branchStatus.forEach(status => {
    status.status = 'completed';
    status.endTime = new Date().toISOString();
});
```

### 3. 资源使用监控
```typescript
const beforeMemory = process.memoryUsage();
const results = await Promise.all(/* ... */);
const afterMemory = process.memoryUsage();
console.log('Memory usage:', {
    before: beforeMemory,
    after: afterMemory,
    delta: afterMemory.heapUsed - beforeMemory.heapUsed
});
```

## 性能考虑

### 优点
- **减少总执行时间**: 并行执行可以显著减少总执行时间
- **提高资源利用率**: 充分利用 CPU 和网络资源
- **改善用户体验**: 更快的响应时间

### 注意事项
- **资源消耗**: 过多的并行分支可能导致资源耗尽
- **错误处理**: 需要仔细考虑部分失败的处理策略
- **状态管理**: 并行分支的状态管理相对复杂
- **调试困难**: 并行执行的错误跟踪和调试相对困难

## 相关组件

- [IteratorNode](./IteratorNode.md): 迭代器节点（可以与 ParallelNode 结合使用）
- [BranchNode](./BranchNode.md): 分支节点（顺序执行 vs 并行执行）
- [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all): JavaScript 并行执行原语

## 示例工作流

完整的示例工作流请参考：
- [并行节点示例](../../examples/mocks/parallel-example.json)
- [测试脚本](../../examples/tests/test-parallel.ts)
