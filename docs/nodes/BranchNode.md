# BranchNode 分支节点

## 概述

BranchNode 实现条件分支逻辑，允许工作流根据运行时条件选择不同的执行路径。它类似于编程语言中的 if-else 语句，但以可视化方式配置。

## 节点特性

- **多分支支持**: 支持定义多个条件和对应的执行路径
- **动态条件评估**: 运行时根据当前状态评估条件表达式
- **顺序匹配**: 按照定义顺序依次检查条件，执行第一个匹配的分支
- **默认路径**: 可选的默认执行路径（当所有条件都不匹配时）

## 接口定义

```typescript
export interface IBranchNode extends INode {
    cases: Array<{
        condition: string;    // 条件表达式
        target: string;       // 目标节点 ID
    }>;
    next?: string;           // 所有条件都不匹配时的默认节点
}
```

## 使用示例

### 1. 基础条件分支

```json
{
  "id": "check-user-type",
  "type": "branch",
  "cases": [
    {
      "condition": "$.user.type === 'vip'",
      "target": "handle-vip-user"
    },
    {
      "condition": "$.user.type === 'regular'",
      "target": "handle-regular-user"
    },
    {
      "condition": "$.user.type === 'guest'",
      "target": "handle-guest-user"
    }
  ],
  "next": "handle-unknown-user"
}
```

### 2. 数值范围判断

```json
{
  "id": "price-range-check",
  "type": "branch",
  "cases": [
    {
      "condition": "$.price >= 1000",
      "target": "high-price-processing"
    },
    {
      "condition": "$.price >= 500",
      "target": "medium-price-processing"
    },
    {
      "condition": "$.price > 0",
      "target": "low-price-processing"
    }
  ],
  "next": "invalid-price"
}
```

### 3. 复杂条件组合

```json
{
  "id": "loan-approval",
  "type": "branch",
  "cases": [
    {
      "condition": "$.creditScore >= 700 && $.income >= 50000",
      "target": "approve-loan"
    },
    {
      "condition": "$.creditScore >= 600 && $.income >= 30000",
      "target": "manual-review"
    }
  ],
  "next": "reject-loan"
}
```

## 条件表达式语法

### 1. 状态引用
```javascript
// 引用根状态输入
"$.user.age"

// 引用其他节点的输出
"previous-node.result.status"

// 引用嵌套属性
"$.order.items.length"
```

### 2. 比较运算符
```javascript
// 等于
"$.status === 'active'"

// 不等于
"$.type !== 'admin'"

// 大于
"$.score > 100"

// 小于等于
"$.count <= 10"
```

### 3. 逻辑运算符
```javascript
// 与运算
"$.age >= 18 && $.hasConsent === true"

// 或运算
"$.type === 'vip' || $.type === 'premium'"

// 非运算
"!$.isBlocked"
```

### 4. 复杂表达式
```javascript
// 数组操作
"$.items.length > 0"

// 字符串匹配
"$.email.includes('@example.com')"

// 数学运算
"$.total * 1.1 > $.budget"
```

## 执行流程

```typescript
// 1. 获取当前状态
const currentState = engine.state.getAll();

// 2. 依次评估每个条件
for (const branchCase of this.cases) {
    const conditionResult = this.evaluateCondition(branchCase.condition, currentState);

    if (conditionResult) {
        // 3. 执行第一个匹配的分支
        await engine.runNode(branchCase.target);
        return;
    }
}

// 4. 如果没有匹配的条件，执行默认路径
if (this.next) {
    await engine.runNode(this.next);
}
```

## 状态管理

### 条件评估中的状态访问
```typescript
// 根状态输入
{
    "$": {
        user: { type: 'vip', score: 750 }
    }
}

// 条件表达式
"$.user.type === 'vip'"  // true
"$.user.score >= 700"     // true
```

### 节点输出
```typescript
// BranchNode 不产生输出，只控制流程
// 但可以记录执行路径
state.setState(this.id, {
    matchedBranch: 'handle-vip-user',
    condition: '$.user.type === \'vip\'',
    executedAt: new Date().toISOString()
});
```

## 错误处理

```typescript
try {
    // 尝试评估条件表达式
    const result = evaluateCondition(condition, state);
} catch (error) {
    console.error('Condition evaluation failed:', error);
    // 可以选择：
    // 1. 跳过当前条件，继续下一个
    // 2. 执行默认路径
    // 3. 抛出错误中断执行
}
```

## 性能优化

- **条件顺序**: 将最可能匹配的条件放在前面
- **复杂度控制**: 避免过于复杂的条件表达式
- **缓存结果**: 对于重复计算的表达式考虑缓存
- **短路评估**: 利用逻辑运算符的短路特性

## 最佳实践

### 1. 条件设计
```json
// ✅ 好的设计：清晰、简洁
{
  "condition": "$.status === 'active'",
  "target": "process-active"
}

// ❌ 避免过于复杂的条件
{
  "condition": "$.a === 1 && $.b === 2 && $.c === 3 && $.d === 4 && $.e === 5",
  "target": "complex-branch"
}
```

### 2. 默认路径
```json
// ✅ 提供有意义的默认路径
{
  "cases": [
    { "condition": "$.type === 'A'", "target": "process-a" },
    { "condition": "$.type === 'B'", "target": "process-b" }
  ],
  "next": "handle-unknown-type"  // 明确的默认处理
}
```

### 3. 错误处理
```json
// ✅ 考虑边界情况
{
  "cases": [
    { "condition": "$.value != null && $.value > 0", "target": "positive" },
    { "condition": "$.value != null && $.value < 0", "target": "negative" }
  ],
  "next": "handle-null-or-zero"  // 处理 null 或 0 的情况
}
```

## 高级用法

### 1. 嵌套分支
```json
// 可以将多个分支节点串联起来实现复杂的决策树
{
  "id": "level-1-branch",
  "cases": [
    { "condition": "$.category === 'electronics'", "target": "level-2-electronics" },
    { "condition": "$.category === 'clothing'", "target": "level-2-clothing" }
  ]
}
```

### 2. 数据验证分支
```json
{
  "id": "data-validation",
  "cases": [
    { "condition": "!$.email || !$.email.includes('@')", "target": "invalid-email" },
    { "condition": "!$.phone || $.phone.length < 10", "target": "invalid-phone" },
    { "condition": "!$.age || $.age < 18", "target": "under-age" }
  ],
  "next": "all-valid"
}
```

### 3. 业务规则分支
```json
{
  "id": "discount-eligibility",
  "cases": [
    {
      "condition": "$.isFirstPurchase && $.orderAmount > 100",
      "target": "apply-first-purchase-discount"
    },
    {
      "condition": "$.loyaltyPoints >= 1000",
      "target": "apply-loyalty-discount"
    },
    {
      "condition": "$.orderAmount > 500",
      "target": "apply-volume-discount"
    }
  ],
  "next": "no-discount"
}
```

## 调试技巧

### 1. 条件表达式测试
```typescript
// 单独测试条件表达式
const testState = {
    user: { type: 'vip', score: 750 }
};
const result = evaluateCondition("$.user.type === 'vip'", testState);
console.log('Condition result:', result);
```

### 2. 执行路径跟踪
```typescript
// 在 BranchNode 中添加日志
console.log(`Evaluating ${this.cases.length} conditions`);
this.cases.forEach((branchCase, index) => {
    console.log(`Condition ${index}: ${branchCase.condition}`);
    const result = evaluateCondition(branchCase.condition, state);
    console.log(`Result: ${result}`);
});
```

### 3. 状态快照
```typescript
// 在分支执行前后保存状态快照
const beforeState = JSON.stringify(engine.state.getAll());
await engine.runNode(target);
const afterState = JSON.stringify(engine.state.getAll());
console.log('State changed:', beforeState !== afterState);
```

## 相关组件

- [ConditionParser](../core/ConditionParser.md): 条件表达式解析器
- [WorkflowEngine](../core/WorkflowEngine.md): 工作流执行引擎
- [ParallelNode](./ParallelNode.md): 并行执行节点

## 示例工作流

完整的示例工作流请参考：
- [分支节点示例](../../examples/mocks/branch-example.json)
- [测试脚本](../../examples/tests/test-branch.ts)
