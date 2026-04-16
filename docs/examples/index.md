# 示例概览

本节提供 AgentFlow 的实际应用示例，帮助您快速上手并理解如何使用各种节点类型。

## 基础示例

### Agent 示例

学习如何使用 Agent 节点与 AI 模型交互。

[查看 Agent 示例 →](/examples/agent-example)

### Function Call 示例

了解如何使用 Function Call 节点执行预定义函数。

[查看 Function Call 示例 →](/examples/fetch-example)

## 流程控制示例

### Branch 示例

学习如何使用 Branch 节点实现条件分支。

[查看 Branch 示例 →](/examples/branch-example)

### Iterator 示例

了解如何使用 Iterator 节点遍历数组数据。

[查看 Iterator 示例 →](/examples/iterator-example)

### Parallel 示例

学习如何使用 Parallel 节点并行执行多个任务。

[查看 Parallel 示例 →](/examples/parallel-example)

## 示例结构

每个示例都包含以下内容：

1. **场景描述**：说明示例的应用场景和目标
2. **工作流配置**：完整的 JSON 配置文件
3. **执行代码**：如何运行示例的代码
4. **预期结果**：示例执行后的预期输出
5. **关键要点**：从示例中学到的关键知识点

## 运行示例

### 1. 克隆仓库

```bash
git clone https://github.com/your-repo/agentflow.git
cd agentflow
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 运行测试

```bash
pnpm test
```

### 4. 运行特定示例

```bash
pnpm test:specific --example agent-example
```

## 示例列表

| 示例名称 | 节点类型 | 难度 | 说明 |
|---------|---------|------|------|
| [Agent 示例](/examples/agent-example) | Agent, Function Call | ⭐ | 基础的 AI 交互示例 |
| [Fetch 示例](/examples/fetch-example) | Function Call | ⭐ | HTTP 请求示例 |
| [Branch 示例](/examples/branch-example) | Branch, Function Call | ⭐⭐ | 条件分支示例 |
| [Iterator 示例](/examples/iterator-example) | Iterator, Function Call | ⭐⭐⭐ | 数组遍历示例 |
| [Parallel 示例](/examples/parallel-example) | Parallel, Function Call | ⭐⭐⭐ | 并行执行示例 |

## 最佳实践

在查看示例时，请注意以下最佳实践：

### 1. 节点命名

使用有意义且唯一的节点 ID：

```json
{
  "id": "fetch-user-data",  // ✅ 好的命名
  "id": "node-1"            // ❌ 不好的命名
}
```

### 2. 数据引用

合理使用数据引用，避免硬编码：

```json
{
  "input": {
    "url": {
      "type": "ref",        // ✅ 使用引用
      "path": "$.apiEndpoint"
    }
  }
}
```

### 3. 错误处理

为关键节点添加错误处理：

```json
{
  "type": "branch",
  "branch": {
    "cases": [
      {
        "condition": "$.status === 'error'",
        "target": "error-handler"
      }
    ]
  }
}
```

### 4. 性能优化

对于独立的任务，使用并行执行：

```json
{
  "type": "parallel",
  "parallel": {
    "branches": ["task-1", "task-2", "task-3"]
  }
}
```

## 下一步

- [Agent 示例](/examples/agent-example) - 从最基础的示例开始
- [API 参考](/api/) - 查看完整的 API 文档
- [核心概念](/guide/nodes) - 深入理解节点类型
