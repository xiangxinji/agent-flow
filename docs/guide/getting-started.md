# 快速开始

欢迎使用 AgentFlow！本指南将帮助您在几分钟内搭建起第一个工作流应用。

## 前置要求

在开始之前，请确保您的开发环境满足以下要求：

- **Node.js**: 版本 18.0 或更高
- **包管理器**: pnpm（推荐）、npm 或 yarn
- **TypeScript**: 版本 5.0 或更高

## 安装

### 使用 pnpm（推荐）

```bash
pnpm install agentflow
```

### 使用 npm

```bash
npm install agentflow
```

### 使用 yarn

```bash
yarn add agentflow
```

## 创建第一个工作流

让我们创建一个简单的工作流，它包含一个 Agent 节点和一个 Function Call 节点。

### 1. 定义工作流配置

创建一个 JSON 文件 `workflow.json`：

```json
{
  "id": "my-first-workflow",
  "name": "我的第一个工作流",
  "version": "1.0.0",
  "nodes": [
    {
      "id": "agent-1",
      "type": "agent",
      "agent": {
        "instructions": "你是一个智能助手，可以帮助用户回答问题。",
        "model": "gpt-4",
        "input": {
          "prompt": {
            "type": "ref",
            "path": "$.userQuestion"
          }
        }
      }
    },
    {
      "id": "logger",
      "type": "function-call",
      "function": {
        "fnName": "tool.log",
        "input": {
          "message": {
            "type": "template",
            "template": "回答结果：${agent-1.output.text}"
          }
        }
      }
    }
  ],
  "edges": [
    {
      "from": "agent-1",
      "to": "logger"
    }
  ],
  "root": "agent-1"
}
```

### 2. 执行工作流

创建一个 TypeScript 文件 `run-workflow.ts`：

```typescript
import { WorkflowEngine } from 'agentflow'
import workflowConfig from './workflow.json'

async function main() {
  const engine = new WorkflowEngine()
  
  const result = await engine.execute(workflowConfig, {
    userQuestion: '什么是人工智能？'
  })
  
  console.log('工作流执行结果:', result)
}

main().catch(console.error)
```

### 3. 运行

```bash
ts-node run-workflow.ts
```

## 下一步

恭喜！您已经成功创建了第一个 AgentFlow 工作流。接下来，您可以：

- 📖 [了解核心概念](/guide/nodes) - 深入理解节点、边和工作流
- 🎯 [探索节点类型](/guide/nodes) - 学习不同类型的节点及其用途
- 💡 [查看示例](/examples/) - 从实际案例中学习
- 🔧 [自定义节点](/guide/custom-nodes) - 创建您自己的节点类型

## 遇到问题？

如果您在使用过程中遇到任何问题，可以：

- 查看 [常见问题](/guide/faq)
- 在 [GitHub Issues](https://github.com) 提交问题
- 加入我们的社区讨论
