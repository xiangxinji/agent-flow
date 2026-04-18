## Context

当前项目需要测试 iterator 节点的功能，确保它能够正确执行迭代逻辑。测试用例已经存在于 mock 目录中，需要将其复制到 examples/mocks 目录并编写测试函数来验证节点的执行逻辑。

## Goals / Non-Goals

**Goals:**
- 复制 mock/iterator.json 文件到 examples/mocks/iterator-example.json
- 修改 examples/tests/test-runner.ts 文件，添加 testIteratorNode() 函数
- 运行测试，验证 iterator 节点的功能是否正常

**Non-Goals:**
- 不修改 src 目录中的源代码
- 不添加新的节点类型或功能
- 不修改现有的测试框架

## Decisions

1. **测试用例选择**：使用 mock 目录中现有的 iterator.json 文件作为测试用例，该文件已经包含了完整的测试场景。
2. **测试方法**：在 test-runner.ts 文件中添加专门的测试函数，直接构建和执行工作流，验证节点的执行逻辑。
3. **验证方式**：通过检查工作流的执行结果来验证节点的执行逻辑，确保 iterator 节点能够正确迭代数组并执行子节点。

## Risks / Trade-offs

1. **Risk**: 测试执行过程中可能会出现模块解析问题，因为直接使用 ts-node 运行测试文件。
   **Mitigation**: 使用 npm test 命令运行测试，它应该有正确的模块解析配置。

2. **Risk**: 事件监听器可能无法正常工作，因为测试环境可能会限制事件的触发。
   **Mitigation**: 直接检查工作流的执行结果，而不是依赖事件监听器。

3. **Risk**: 测试用例可能会因为工作流引擎的内部实现变化而失败。
   **Mitigation**: 保持测试用例的简单性，只测试基本的执行逻辑。