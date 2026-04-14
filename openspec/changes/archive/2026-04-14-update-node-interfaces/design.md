## Context

当前项目中，IIteratorNode 接口使用了专属的 key 标记（`iterator`）来存储配置，而 IBranchNode 和 IParallelNode 接口直接在节点对象上定义属性。为了保持一致性，需要为 IBranchNode 和 IParallelNode 接口也添加专属的 key 标记。

## Goals / Non-Goals

**Goals:**
- 为 IBranchNode 接口添加专属的 `branch` key 标记
- 为 IParallelNode 接口添加专属的 `parallel` key 标记
- 更新 BranchNode 类以适应新的接口定义
- 更新 ParallelNode 类以适应新的接口定义

**Non-Goals:**
- 不修改其他节点接口的定义
- 不修改工作流引擎的核心逻辑
- 不添加新的节点类型

## Decisions

1. **接口设计**：为 IBranchNode 和 IParallelNode 接口添加专属的 key 标记，使节点配置更加一致和清晰。
2. **实现方式**：修改相应的节点实现类，更新构造函数和方法以适应新的接口定义。
3. **兼容性**：确保修改后的接口与现有的工作流配置兼容。

## Risks / Trade-offs

1. **Risk**: 修改接口定义可能会影响现有的工作流配置。
   **Mitigation**: 确保修改后的接口与现有的工作流配置兼容，或者提供迁移工具。

2. **Risk**: 修改节点实现可能会引入新的 bug。
   **Mitigation**: 仔细测试修改后的代码，确保所有功能正常工作。