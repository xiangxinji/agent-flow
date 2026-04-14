# Tasks: Update Node Interfaces

## Summary

为 IBranchNode 和 IParallelNode 接口添加专属的 key 标记，类似于 IIteratorNode 接口，使节点配置更加一致和清晰。

## Tasks

### 1. 修改接口定义
- [x] 修改 `src/core/interface/graph/graph.ts` 文件，为 IBranchNode 接口添加专属的 `branch` key 标记
- [x] 修改 `src/core/interface/graph/graph.ts` 文件，为 IParallelNode 接口添加专属的 `parallel` key 标记

### 2. 更新节点实现
- [x] 修改 `src/core/workflow/node/branch.ts` 文件，更新 BranchNode 类以适应新的接口定义
- [x] 修改 `src/core/workflow/node/parallel.ts` 文件，更新 ParallelNode 类以适应新的接口定义

### 3. 验证和测试
- [x] 确保修改后的接口与现有的工作流配置兼容
- [x] 确保修改后的节点实现能够正常工作

## Notes

- 保持与 IIteratorNode 接口的一致性
- 确保修改后的接口与现有的工作流配置兼容
- 仔细测试修改后的代码，确保所有功能正常工作