# AgentFlow

工作流引擎 - 基于节点的工作流执行系统

## 项目简介

AgentFlow 是一个强大的工作流引擎，基于节点系统设计，支持复杂的工作流定义和执行。它提供了直观的节点系统，包括分支节点、并行节点、迭代器节点等，使您能够构建灵活且可扩展的工作流。

## 核心特性

- **多种节点类型**：支持执行器、分支、迭代器、子图和并行节点
- **图形化构建**：使用 GraphBuilder 从 JSON 定义构建工作流
- **事件系统**：支持工作流执行过程中的事件监听和触发
- **历史记录**：自动记录工作流执行历史
- **Mastra 集成**：集成了 Mastra AI 框架，支持 AI 能力
- **类型安全**：使用 TypeScript 开发，提供完整的类型定义

## 技术栈

- TypeScript
- Node.js
- Hono (HTTP 服务器)
- Mastra (AI 框架)
- Zod (数据验证)

## 安装

### 前提条件

- Node.js 18.0 或更高版本
- npm 或 pnpm 包管理器

### 安装步骤

1. 克隆项目

```bash
git clone <repository-url>
cd AgentFlow
```

2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

3. 构建项目

```bash
npm run build
```

## 快速开始

### 1. 定义工作流

创建一个工作流定义文件（例如 `workflow.json`）：

```json
{
  "id": "example-workflow",
  "name": "Example Workflow",
  "version": "1.0.0",
  "root": "start",
  "nodes": [
    {
      "id": "start",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Hello, AgentFlow!"
        }
      }
    }
  ],
  "edges": []
}
```

### 2. 运行工作流

```typescript
import { GraphBuilder, WorkflowEngine } from 'agentflow';
import * as fs from 'fs';

// 读取工作流定义
const workflowJson = JSON.parse(fs.readFileSync('workflow.json', 'utf8'));

// 构建工作流
const builder = new GraphBuilder(workflowJson);
const workflow = builder.build();

// 创建引擎并运行
const engine = new WorkflowEngine(workflow);
const result = await engine.run();

console.log('Workflow result:', result);
```

## API 文档

### GraphBuilder

用于从 JSON 定义构建工作流。

```typescript
import { GraphBuilder } from 'agentflow';

const builder = new GraphBuilder(workflowJson);
const workflow = builder.build();
```

### WorkflowEngine

用于运行工作流。

```typescript
import { WorkflowEngine } from 'agentflow';

const engine = new WorkflowEngine(workflow);

// 运行整个工作流
const result = await engine.run(input);

// 运行单个节点
const nodeResult = await engine.runNode(nodeId);
```

### functionRegistry

用于注册和管理函数。

```typescript
import { functionRegistry } from 'agentflow';

// 注册函数
functionRegistry.register('myFunction', (input) => {
  return { result: input.value * 2 };
});
```

## 节点类型

### 1. Executor Node

执行指定的函数。

```json
{
  "id": "executor-1",
  "type": "executor",
  "executor": {
    "function": "log",
    "input": {
      "message": "Hello World"
    }
  }
}
```

### 2. Branch Node

根据条件执行不同的分支。

```json
{
  "id": "branch-1",
  "type": "branch",
  "branch": {
    "condition": "$.value > 10",
    "cases": [
      {
        "condition": "$.value > 10",
        "target": "node-a"
      },
      {
        "condition": "$.value <= 10",
        "target": "node-b"
      }
    ],
    "default": "node-c"
  }
}
```

### 3. Iterator Node

迭代执行指定的节点。

```json
{
  "id": "iterator-1",
  "type": "iterator",
  "iterator": {
    "target": "process-item",
    "collection": "$.items",
    "item": "item"
  }
}
```

### 4. Parallel Node

并行执行多个分支。

```json
{
  "id": "parallel-1",
  "type": "parallel",
  "parallel": {
    "branches": ["branch-1", "branch-2"],
    "next": "merge"
  }
}
```

### 5. SubGraph Node

执行子工作流。

```json
{
  "id": "subgraph-1",
  "type": "subgraph",
  "subgraph": {
    "workflow": "sub-workflow-id"
  }
}
```

## 示例

### 基本执行器示例

```json
{
  "id": "basic-example",
  "name": "Basic Example",
  "version": "1.0.0",
  "root": "start",
  "nodes": [
    {
      "id": "start",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Starting workflow"
        }
      }
    },
    {
      "id": "process",
      "type": "executor",
      "executor": {
        "function": "toJson",
        "input": {
          "data": { "key": "value" }
        }
      }
    },
    {
      "id": "end",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Workflow completed"
        }
      }
    }
  ],
  "edges": [
    { "from": "start", "to": "process" },
    { "from": "process", "to": "end" }
  ]
}
```

### 分支节点示例

```json
{
  "id": "branch-example",
  "name": "Branch Example",
  "version": "1.0.0",
  "root": "start",
  "nodes": [
    {
      "id": "start",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Starting branch workflow"
        }
      }
    },
    {
      "id": "branch",
      "type": "branch",
      "branch": {
        "cases": [
          {
            "condition": "$.value > 5",
            "target": "greater-than-5"
          },
          {
            "condition": "$.value <= 5",
            "target": "less-than-or-equal-5"
          }
        ]
      }
    },
    {
      "id": "greater-than-5",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Value is greater than 5"
        }
      }
    },
    {
      "id": "less-than-or-equal-5",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Value is less than or equal to 5"
        }
      }
    },
    {
      "id": "end",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Branch workflow completed"
        }
      }
    }
  ],
  "edges": [
    { "from": "start", "to": "branch" },
    { "from": "greater-than-5", "to": "end" },
    { "from": "less-than-or-equal-5", "to": "end" }
  ]
}
```

### 并行节点示例

```json
{
  "id": "parallel-example",
  "name": "Parallel Example",
  "version": "1.0.0",
  "root": "start",
  "nodes": [
    {
      "id": "start",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Starting parallel workflow"
        }
      }
    },
    {
      "id": "parallel",
      "type": "parallel",
      "parallel": {
        "branches": ["branch-1", "branch-2"],
        "next": "end"
      }
    },
    {
      "id": "branch-1",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Executing branch 1"
        }
      }
    },
    {
      "id": "branch-2",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Executing branch 2"
        }
      }
    },
    {
      "id": "end",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Parallel workflow completed"
        }
      }
    }
  ],
  "edges": [
    { "from": "start", "to": "parallel" },
    { "from": "branch-1", "to": "end" },
    { "from": "branch-2", "to": "end" }
  ]
}
```

### 迭代器节点示例

```json
{
  "id": "iterator-example",
  "name": "Iterator Example",
  "version": "1.0.0",
  "root": "start",
  "nodes": [
    {
      "id": "start",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Starting iterator workflow"
        }
      }
    },
    {
      "id": "iterator",
      "type": "iterator",
      "iterator": {
        "target": "process-item",
        "collection": "$.items",
        "item": "item"
      }
    },
    {
      "id": "process-item",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Processing item: $.item"
        }
      }
    },
    {
      "id": "end",
      "type": "executor",
      "executor": {
        "function": "log",
        "input": {
          "message": "Iterator workflow completed"
        }
      }
    }
  ],
  "edges": [
    { "from": "start", "to": "iterator" },
    { "from": "process-item", "to": "end" }
  ]
}
```

## 开发

### 运行开发服务器

```bash
npm run dev
```

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm run test:specific

# 监视模式运行测试
npm run test:watch
```

### 类型检查

```bash
npm run type-check
```

## 项目结构

```
AgentFlow/
├── src/
│   ├── core/          # 核心代码
│   │   ├── enums/     # 枚举类型
│   │   ├── factory/   # 工厂类
│   │   ├── graph/     # 图形构建
│   │   ├── interface/ # 接口定义
│   │   └── workflow/  # 工作流实现
│   ├── api/           # API接口
│   ├── function/      # 函数注册
│   ├── mastra/        # Mastra集成
│   └── utils/         # 工具函数
├── examples/          # 示例代码
│   ├── mocks/         # 模拟数据
│   └── tests/         # 测试代码
├── docs/              # 文档
├── openspec/          # 规范定义
├── package.json       # 项目配置
└── tsconfig.json      # TypeScript配置
```

## 许可证

ISC

## 贡献

欢迎贡献代码、报告问题或提出建议！

## 联系方式

如有任何问题或建议，请通过以下方式联系我们：

- 项目地址：<repository-url>
- 问题跟踪：<repository-url>/issues
