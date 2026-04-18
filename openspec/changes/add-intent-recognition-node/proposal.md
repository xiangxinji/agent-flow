# Intent Recognition Node Proposal

## Why

当前的 branch 节点使用硬编码的条件表达式进行路由，存在以下问题：

1. **灵活度低**: 需要预先定义所有可能的分支条件和目标节点
2. **维护成本高**: 每次新增意图都需要修改工作流配置
3. **无法处理未知意图**: 只能处理预定义的条件，无法动态适应新的用户意图

意图识别节点通过 AI Agent 分析输入状态，动态识别用户意图并路由到对应节点，解决了 branch 节点灵活度不足的问题。这使得工作流能够：
- 根据自然语言输入智能路由
- 动态适应新的意图场景
- 减少硬编码条件配置

## What Changes

### 新增功能
- 新增 `intent-recognition` 节点类型
- 使用 Agent 分析输入状态并识别意图
- 支持意图到目标节点的映射配置
- 支持默认路由（当无法识别意图时）
- 支持意图识别结果的存储和传递

### 节点配置
- `agent`: Agent 配置（instructions, model）
- `input`: 输入数据源配置
- `intentions`: 意图映射配置（意图名称 -> 目标节点）
- `defaultTarget`: 默认目标节点（可选）
- `outputKey`: 意图识别结果的存储键名（可选）

### 工作流程
1. 接收上游节点的状态或 root 状态
2. 使用 Agent 分析输入并识别意图
3. 根据意图映射配置找到目标节点
4. 将意图识别结果存储到状态中
5. 路由到目标节点执行

## Capabilities

### New Capabilities
- `intent-recognition-node`: 意图识别节点功能，包括节点定义、执行器、配置接口

### Modified Capabilities
- `graph-node-types`: 新增 `intent-recognition` 节点类型到 GraphNodeType
- `executor-factory`: 新增 IntentRecognitionExecutor 的工厂方法

## Impact

### 代码影响
- `src/core/interface/graph/graph.ts`: 新增 IIntentRecognitionNode 接口，更新 GraphNodeType
- `src/core/workflow/node/`: 新增 intent-recognition.ts 节点实现
- `src/core/workflow/executor/`: 新增 intent-recognition.ts 执行器
- `src/core/factory/executor-factory.ts`: 注册新的执行器
- `examples/mocks/`: 新增示例配置文件

### API 影响
- 新增节点类型：`intent-recognition`
- 新增配置字段：`intentions`（意图映射）、`defaultTarget`（默认目标）

### 依赖影响
- 依赖现有的 Agent 执行能力
- 依赖状态管理机制

### 向后兼容性
- 完全向后兼容，不影响现有节点类型
- 新节点类型为可选功能
