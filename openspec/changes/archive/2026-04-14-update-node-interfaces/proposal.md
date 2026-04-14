## Why

需要为 IBranchNode 和 IParallelNode 接口添加专属的 key 标记，类似于 IIteratorNode 接口，使节点配置更加一致和清晰。

## What Changes

- 修改 `src/core/interface/graph/graph.ts` 文件，为 IBranchNode 和 IParallelNode 接口添加专属的 key 标记
- 修改 `src/core/workflow/node/branch.ts` 文件，更新 BranchNode 类以适应新的接口定义
- 修改 `src/core/workflow/node/parallel.ts` 文件，更新 ParallelNode 类以适应新的接口定义

## Capabilities

### New Capabilities
- `update-node-interfaces`: 更新节点接口定义，为 IBranchNode 和 IParallelNode 接口添加专属的 key 标记

### Modified Capabilities

## Impact

- 影响 `src/core/interface/graph/graph.ts` 文件，修改 IBranchNode 和 IParallelNode 接口定义
- 影响 `src/core/workflow/node/branch.ts` 文件，更新 BranchNode 类以适应新的接口定义
- 影响 `src/core/workflow/node/parallel.ts` 文件，更新 ParallelNode 类以适应新的接口定义