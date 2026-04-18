## Overview

测试 iterator 节点的迭代逻辑，确保能够正确迭代数组并执行子节点。

## Requirements

1. **功能要求**：
   - iterator 节点能够正确迭代数组
   - 对数组中的每个元素执行子节点
   - 迭代完成后执行 next 节点

2. **测试要求**：
   - 复制 mock/iterator.json 文件到 examples/mocks/iterator-example.json
   - 在 examples/tests/test-runner.ts 中添加 testIteratorNode() 函数
   - 验证 iterator 节点的执行逻辑

## Test Cases

1. **测试用例**：
   - 输入：{ "url": "http://www.baidu.com", "number": "1" }
   - 迭代数组：["item1", "item2", "item3"]
   - 预期结果：执行 test-1 → test-2 (迭代 3 次) → test-3

## Acceptance Criteria

1. 测试用例能够正常运行
2. iterator 节点能够正确迭代数组
3. 测试结果符合预期