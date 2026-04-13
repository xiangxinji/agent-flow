# Agent Flow 工作流引擎文档

## 📚 文档目录

### 节点类型文档
- [基础节点 (BaseNode)](./nodes/BaseNode.md)
- [执行器节点 (ExecutorNode)](./nodes/ExecutorNode.md)
- [分支节点 (BranchNode)](./nodes/BranchNode.md)
- [并行节点 (ParallelNode)](./nodes/ParallelNode.md)
- [迭代器节点 (IteratorNode)](./nodes/IteratorNode.md)
- [子图节点 (SubGraphNode)](./nodes/SubGraphNode.md)

### 核心组件文档
- [工作流引擎 (WorkflowEngine)](./core/WorkflowEngine.md)
- [状态管理 (StateManager)](./core/StateManager.md)
- [节点工厂 (NodeFactory)](./core/NodeFactory.md)
- [图构建器 (GraphBuilder)](./core/GraphBuilder.md)

### 开发指南
- [快速开始](./guides/quick-start.md)
- [节点开发指南](./guides/node-development.md)
- [函数注册指南](./guides/function-registration.md)
- [测试指南](./guides/testing.md)

## 🏗️ 项目结构

```
agent-flow/
├── src/
│   ├── core/              # 核心引擎
│   │   ├── workflow/      # 工作流和节点
│   │   ├── factory/       # 工厂模式
│   │   └── graph/         # 图构建
│   ├── interface/         # 接口定义
│   ├── function/          # 内置函数
│   └── api/              # HTTP API
├── examples/             # 示例和测试
│   ├── mocks/            # 工作流 JSON 定义
│   ├── tests/            # 测试脚本
│   └── functions/        # Mock 函数
├── docs/                 # 文档
└── tests/                # 单元测试
```

## 🚀 快速开始

### 1. 基础节点执行

```typescript
import { WorkflowEngine } from '@/core/workflow/engine';
import { GraphBuilder } from '@/core/graph/builder';

// 构建工作流
const builder = new GraphBuilder(workflowJson);
const workflow = builder.build();

// 执行工作流
const engine = new WorkflowEngine(workflow);
const result = await engine.run({ input: 'data' });
```

### 2. 节点类型选择

- **AgentNode**: AI 智能体执行
- **FunctionCallNode**: 调用预定义函数
- **BranchNode**: 条件分支
- **ParallelNode**: 并行执行
- **IteratorNode**: 数组迭代
- **SubGraphNode**: 子工作流调用

## 📋 节点对比

| 节点类型 | 用途 | 控制流 | 数据流 |
|---------|------|--------|--------|
| ExecutorNode | 执行单一任务 | 单路径 | 单输入单输出 |
| BranchNode | 条件分支 | 多路径单选 | 单输入单输出 |
| ParallelNode | 并行执行 | 多路径并行 | 单输入多输出 |
| IteratorNode | 数组迭代 | 循环执行 | 数组输入聚合输出 |
| SubGraphNode | 子工作流 | 嵌套执行 | 映射输入输出 |

## 🔗 相关资源

- [项目 README](../README.md)
- [CLAUDE.md](../CLAUDE.md)
- [API 文档](./api/README.md)
