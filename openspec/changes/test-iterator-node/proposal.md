## Why

需要测试 iterator 节点的功能，确保它能够正确执行迭代逻辑，提高工作流引擎的可靠性和稳定性。

## What Changes

- 复制 mock 目录中的 iterator.json 文件到 examples/mocks 目录
- 修改 examples/tests/test-runner.ts 文件，添加测试函数来验证 iterator 节点的执行逻辑
- 运行测试，验证 iterator 节点的功能是否正常

## Capabilities

### New Capabilities
- `iterator-test`: 测试 iterator 节点的迭代逻辑，确保能够正确迭代数组并执行子节点

### Modified Capabilities

## Impact

- 影响 examples/tests/test-runner.ts 文件，添加测试函数
- 影响 examples/mocks 目录，添加测试用例文件