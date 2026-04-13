# Examples 示例和测试

## 📁 目录结构

```
examples/
├── mocks/              # 工作流 JSON 定义
│   ├── executor-example.json
│   ├── branch-example.json
│   ├── parallel-example.json
│   ├── iterator-example.json
│   ├── subgraph-example.json
│   └── agent-example.json
├── tests/              # 测试脚本
│   ├── test-runner.ts      # 统一测试框架
│   ├── run-all-tests.ts    # 主测试入口
│   └── test-*.ts           # 单个节点测试
├── functions/          # Mock 函数
│   └── mock-functions.ts    # 所有测试用到的模拟函数
└── README.md           # 本文件
```

## 🚀 快速开始

### 1. 构建项目

```bash
npm run build
```

### 2. 运行所有测试

```bash
npm test
```

### 3. 运行特定测试

```bash
npm run test:specific
```

### 4. 监视模式测试

```bash
npm run test:watch
```

## 📋 可用测试

### 节点类型测试

| 节点类型 | 示例文件 | 描述 |
|---------|----------|------|
| ExecutorNode | executor-example.json | 基础执行器节点 |
| BranchNode | branch-example.json | 条件分支节点 |
| ParallelNode | parallel-example.json | 并行执行节点 |
| IteratorNode | iterator-example.json | 数组迭代节点 |
| SubGraphNode | subgraph-example.json | 子工作流节点 |
| AgentNode | agent-example.json | AI 智能体节点 |

## 🧪 测试框架

### TestRunner

统一的测试框架，提供以下功能：

- **批量测试**: 自动运行所有示例工作流
- **事件监听**: 监控工作流执行过程
- **结果统计**: 生成测试报告和统计数据
- **错误处理**: 优雅处理测试失败情况

### 使用方法

```typescript
import { TestRunner } from './tests/test-runner';
import { allMockFunctions } from './functions/mock-functions';

// 创建测试运行器
const runner = new TestRunner();

// 注册 mock 函数
runner.registerMockFunctions(allMockFunctions);

// 运行所有测试
await runner.runAllTests();

// 保存测试报告
runner.saveReport();
```

## 📊 测试报告

测试执行后会生成 `test-report.json`，包含：

- 执行摘要（总数、成功数、失败数）
- 每个测试的详细结果
- 执行时间统计
- 错误信息（如有）

### 示例报告

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "summary": {
    "total": 6,
    "successful": 5,
    "failed": 1,
    "totalDuration": 3456
  },
  "tests": [
    {
      "name": "executor-example",
      "success": true,
      "duration": 234,
      "result": { /* ... */ }
    }
    // ... 更多测试结果
  ]
}
```

## 🛠️ 开发指南

### 添加新的示例工作流

1. 在 `mocks/` 目录创建新的 JSON 文件
2. 按照工作流 DSL 格式定义节点和边
3. 在 `functions/mock-functions.ts` 中添加所需的 mock 函数
4. 运行测试验证工作流正确执行

### 添加新的 Mock 函数

```typescript
import { ExecutorFunction } from '../../src/core/function/base';

export class MyCustomFunction extends ExecutorFunction<any, any> {
    name = "myCustomFunction";

    async execute(input: any): Promise<any> {
        // 实现自定义逻辑
        console.log(`执行自定义函数: ${JSON.stringify(input)}`);
        return { result: 'success' };
    }
}

// 导出并注册
export const allMockFunctions = [
    // ... 其他函数
    new MyCustomFunction()
];
```

### 调试单个工作流

```typescript
import { GraphBuilder } from '../../src/core/graph/builder';
import { WorkflowEngine } from '../../src/core/workflow/engine';
import * as fs from 'fs';

// 加载工作流定义
const workflowJson = JSON.parse(fs.readFileSync('mocks/my-workflow.json', 'utf-8'));

// 构建工作流
const builder = new GraphBuilder(workflowJson);
const workflow = builder.build();

// 创建执行引擎
const engine = new WorkflowEngine(workflow);

// 设置事件监听
engine.event.on('NODE-EXECUTE-BEFORE', (nodeId) => {
    console.log(`开始执行节点: ${nodeId}`);
});

// 运行工作流
const result = await engine.run({ /* 输入数据 */ });
console.log('执行结果:', result);
```

## 📝 工作流 DSL 格式

### 基础结构

```json
{
  "id": "workflow-id",
  "name": "工作流名称",
  "version": "1.0.0",
  "root": "起始节点ID",
  "nodes": [ /* 节点数组 */ ],
  "edges": [ /* 边数组 */ ]
}
```

### 节点定义

```json
{
  "id": "node-id",
  "type": "function-call", // 或 agent, branch, parallel, iterator, subgraph
  "config": { /* 节点特定配置 */ }
}
```

### 边定义

```json
{
  "from": "源节点ID",
  "to": "目标节点ID"
}
```

## 🔧 故障排除

### 常见问题

1. **工作流构建失败**
   - 检查 JSON 格式是否正确
   - 确认所有引用的节点 ID 都存在
   - 验证边连接是否有效

2. **节点执行失败**
   - 确认所需的 mock 函数已注册
   - 检查输入参数格式是否正确
   - 查看控制台错误信息

3. **状态访问错误**
   - 确认状态路径语法正确
   - 检查节点执行顺序
   - 验证状态键名拼写

### 调试技巧

1. **启用详细日志**
   ```typescript
   engine.event.on('*', (...args) => {
     console.log('Event:', ...args);
   });
   ```

2. **检查工作流结构**
   ```typescript
   console.log('Nodes:', workflow.nodes);
   console.log('Edges:', workflow.edges);
   ```

3. **验证状态传递**
   ```typescript
   console.log('Current state:', engine.state.getAll());
   ```

## 📚 相关文档

- [节点类型文档](../../docs/nodes/)
- [核心组件文档](../../docs/core/)
- [开发指南](../../docs/guides/)
- [项目 README](../../README.md)

## 🤝 贡献指南

欢迎贡献新的示例和测试！

1. 确保代码通过 `npm run type-check`
2. 运行 `npm test` 验证所有测试通过
3. 添加适当的文档和注释
4. 遵循现有的代码风格

## 📄 许可证

ISC
