# 🚀 快速开始指南

## 安装依赖

```bash
pnpm install
```

## 运行示例

### 1. 基础用法示例（2个节点）

```bash
# 使用 npm 脚本
npm run dev

# 或直接运行
npx ts-node src/examples/basic-usage.ts
```

这个示例展示了：
- 创建包含 Agent 和 Tool 两个节点的工作流
- 使用模板字符串引用前一个节点的输出
- 编译和执行工作流

### 2. 三节点线性流示例

```bash
# 使用 npm 脚本
npm run dev:three-node

# 或直接运行
npx ts-node src/examples/three-node-linear-flow.ts
```

这个示例展示了：
- 创建包含 Agent、Tool、Workflow 三个节点的线性流
- 变量解析器的详细用法
- 节点间的变量流转和映射
- 完整的编译和执行流程

## 代码结构

```typescript
import {
  Workflow,          // 工作流类
  AgentNode,        // Agent 节点
  ToolNode,         // Tool 节点
  WorkflowNode,     // Workflow 节点
  Edge,             // 边（连接）
  EdgeType,         // 边类型
  MastraCompiler,   // 编译器
  VariableResolver  // 变量解析器
} from 'agent-flow';
```

## 核心概念

### 1. 工作流（Workflow）

工作流是节点和边的容器，定义了完整的执行流程。

```typescript
const workflow = new Workflow(
  'workflow-id',           // 唯一标识
  '工作流名称',            // 显示名称
  '工作流描述',           // 描述（可选）
  { globalVar: 'value' }  // 全局变量（可选）
);
```

### 2. 节点（Node）

节点是工作流的基本执行单元。

```typescript
// Agent 节点
const agentNode = new AgentNode('node-id', '节点名称', {
  executorId: 'agent-executor',
  input: {
    prompt: '处理: {{input.data}}'  // 使用模板字符串
  },
  output: {
    variables: {
      result: 'response'  // 输出变量映射
    }
  }
});

// Tool 节点
const toolNode = new ToolNode('tool-id', '工具名称', {
  executorId: 'tool-executor',
  input: {
    data: '{{agent-node.result}}'  // 引用其他节点的输出
  }
});
```

### 3. 边（Edge）

边定义节点之间的连接关系和数据流转。

```typescript
const edge = new Edge(
  'edge-id',               // 边的唯一标识
  'source-node',          // 源节点ID
  'target-node',          // 目标节点ID
  EdgeType.SEQUENCE,      // 边类型
  undefined,              // 条件（可选）
  {                       // 变量映射（可选）
    'response': 'inputData',
    'confidence': {
      target: 'confidenceLevel',
      transform: (v) => v * 100,
      defaultValue: 0.95
    }
  }
);
```

### 4. 变量解析

支持两种模板字符串格式：

```typescript
// {{variable}} 格式
const template1 = 'Hello, {{user.name}}!';

// ${variable} 格式
const template2 = 'Version: ${workflow.version}';

// 混合使用
const template3 = '{{user.name}} uses version ${workflow.version}';

// 解析模板
const resolver = new VariableResolver({
  user: { name: 'Alice' },
  workflow: { version: '1.0.0' }
});

const result = resolver.resolve(template3);
// "Alice uses version 1.0.0"
```

### 5. 编译和执行

```typescript
// 创建编译器
const compiler = new MastraCompiler('mastra');

// 编译工作流
const compiled = compiler.compile(workflow);

// 执行工作流
const result = await compiled.execute({
  data: '输入数据'
});

// 查看结果
console.log('成功:', result.success);
console.log('输出:', result.output);
console.log('各步骤结果:', result.stepResults);
```

## 常用模式

### 1. 线性执行流

```typescript
node1 -> node2 -> node3 -> node4
```

### 2. 条件分支

```typescript
       -> node2 (条件A)
node1
       -> node3 (条件B)
```

### 3. 并行执行

```typescript
       -> node2
node1
       -> node3
       -> node4
```

### 4. 变量流转

```typescript
// 节点1的输出
{
  "response": "分析结果",
  "confidence": 0.95
}

// 在节点2中引用
input: {
  data: '{{node-1.response}}',
  level: '{{node-1.confidence}}'
}
```

## 验证工作流

在执行前验证工作流配置：

```typescript
const validation = workflow.validate();
if (!validation.isValid) {
  console.error('验证失败:', validation.errors);
  return;
}
console.log('验证通过!');
```

## 查看执行顺序

```typescript
// 拓扑排序获取执行顺序
const sortedNodes = workflow.topologicalSort();
sortedNodes.forEach((node, index) => {
  console.log(`${index + 1}. ${node.id} (${node.name})`);
});
```

## 错误处理

```typescript
const result = await compiled.execute(input);

if (!result.success) {
  console.error('执行失败:', result.errors);
} else {
  console.log('执行成功!');
  console.log('输出:', result.output);
}
```

## 下一步

- 查看 [README_OOP_ENGINE.md](./README_OOP_ENGINE.md) 了解详细文档
- 查看 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) 了解实现细节
- 探索 `src/examples/` 目录中的更多示例
- 阅读 `src/dsl/` 和 `src/adapters/` 中的源代码

## 开发模式

```bash
# 类型检查
npm run type-check

# 编译
npm run build

# 运行示例
npm run dev
npm run dev:three-node
```

## 获取帮助

如果遇到问题：
1. 检查 TypeScript 编译是否通过
2. 查看示例代码的输出
3. 阅读相关接口和类的注释
4. 查看 README 文档

祝你使用愉快！🎉