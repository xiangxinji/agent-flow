# Agent Flow - OOP DSL 引擎

基于面向对象思想的工作流 DSL 编译器，实现节点之间的变量流转和编排。

## 📋 目录结构

```
src/
├── dsl/                    # DSL 核心模块
│   ├── interfaces/         # 接口定义
│   │   ├── INode.ts       # 节点接口
│   │   ├── IEdge.ts       # 边接口
│   │   └── IWorkflow.ts   # 工作流接口
│   ├── nodes/             # 节点实现
│   │   ├── BaseNode.ts    # 节点抽象基类
│   │   ├── AgentNode.ts   # Agent 节点
│   │   ├── ToolNode.ts    # Tool 节点
│   │   └── WorkflowNode.ts # Workflow 节点
│   ├── edge/              # 边实现
│   │   └── Edge.ts        # 边类
│   ├── workflow/          # 工作流实现
│   │   └── Workflow.ts    # 工作流类
│   ├── resolver/          # 变量解析器
│   │   └── VariableResolver.ts # 变量流转核心
│   ├── compiler/          # 编译器
│   │   └── MastraCompiler.ts # Mastra 编译器
│   └── index.ts           # DSL 模块导出
├── adapters/              # 适配器模块
│   ├── interfaces/        # 适配器接口
│   ├── base/             # 基础适配器
│   ├── mastra/           # Mastra 适配器
│   └── factory/          # 适配器工厂
├── examples/             # 示例代码
│   ├── basic-usage.ts    # 基础用法
│   └── three-node-linear-flow.ts # 三节点线性流
└── index.ts             # 主入口
```

## 🎯 核心特性

### 1. 面向对象设计

- **接口驱动**: 定义清晰的接口契约
- **抽象基类**: 提供通用功能实现
- **继承扩展**: 易于添加新的节点类型和适配器

### 2. 变量流转机制

支持两种模板字符串格式：

```typescript
// {{variable}} 格式
const template1 = 'Hello, {{user.name}}!';

// ${variable} 格式
const template2 = 'Version: ${workflow.version}';

// 混合使用
const template3 = '{{user.name}} uses version ${workflow.version}';
```

### 3. 节点编排

支持线性、分支和并行执行模式：

```typescript
// 线性执行
const edge1 = new Edge('edge-1', 'node-1', 'node-2', EdgeType.SEQUENCE);

// 条件分支
const edge2 = new Edge('edge-2', 'node-1', 'node-3', EdgeType.CONDITIONAL, {
  expression: '{{score}} > 0.8'
});

// 并行执行
const edge3 = new Edge('edge-3', 'node-1', 'node-4', EdgeType.PARALLEL);
```

### 4. 变量映射

通过边配置实现精确的变量流转：

```typescript
const edge = new Edge('edge-1', 'source-node', 'target-node', EdgeType.SEQUENCE, undefined, {
  // 简单映射
  'response': 'inputText',

  // 带转换的映射
  'confidence': {
    target: 'confidenceLevel',
    transform: (value) => value * 100,
    defaultValue: 0.95
  }
});
```

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 运行示例

```bash
# 基础用法示例
pnpm run dev

# 或者直接运行 TypeScript
npx ts-node src/examples/basic-usage.ts

# 三节点线性流示例
npx ts-node src/examples/three-node-linear-flow.ts
```

## 📖 使用指南

### 创建工作流

```typescript
import { Workflow, AgentNode, ToolNode, Edge, EdgeType } from 'agent-flow';

// 1. 创建工作流
const workflow = new Workflow(
  'my-workflow',
  '我的工作流',
  '工作流描述'
);

// 2. 创建节点
const agentNode = new AgentNode('agent-1', 'Agent 节点', {
  executorId: 'my-agent',
  input: {
    prompt: '处理: {{input.data}}'
  }
});

const toolNode = new ToolNode('tool-1', 'Tool 节点', {
  executorId: 'my-tool',
  input: {
    data: '{{agent-1.response}}' // 引用前一个节点的输出
  }
});

// 3. 添加节点
workflow.addNode(agentNode);
workflow.addNode(toolNode);

// 4. 创建连接
const edge = new Edge(
  'edge-1',
  'agent-1',
  'tool-1',
  EdgeType.SEQUENCE
);
workflow.addEdge(edge);

// 5. 验证工作流
const validation = workflow.validate();
if (!validation.isValid) {
  throw new Error(validation.errors.join(', '));
}
```

### 编译和执行

```typescript
import { MastraCompiler } from 'agent-flow';

// 创建编译器
const compiler = new MastraCompiler('mastra');

// 编译工作流
const compiled = compiler.compile(workflow);

// 执行工作流
const result = await compiled.execute({
  data: '输入数据'
});

// 查看结果
console.log('执行结果:', result.output);
console.log('各步骤结果:', result.stepResults);
```

### 使用变量解析器

```typescript
import { VariableResolver } from 'agent-flow';

const resolver = new VariableResolver({
  user: { name: 'Alice' },
  version: '1.0.0'
});

// 解析模板字符串
const result = resolver.resolve('Hello, {{user.name}}! Version: ${version}');
console.log(result); // "Hello, Alice! Version: 1.0.0"

// 解析对象
const obj = {
  greeting: 'Hello, {{user.name}}',
  info: 'Version: ${version}'
};
console.log(resolver.resolve(obj));
// { greeting: "Hello, Alice", info: "Version: 1.0.0" }

// 提取变量
const variables = resolver.extractVariables('{{user.name}} and ${version}');
console.log(variables); // ["user.name", "version"]

// 验证模板
const validation = resolver.validateTemplate('Hello, {{user.name}} from {{company}}');
console.log(validation);
// { valid: false, missingVariables: ["company"] }
```

## 🔧 扩展开发

### 添加新的节点类型

```typescript
import { BaseNode, NodeType } from 'agent-flow';

export class CustomNode extends BaseNode {
  constructor(id: string, name: string, config: NodeConfig = {}) {
    super(id, name, NodeType.CUSTOM, config);
  }

  protected validateCustom(): string[] {
    const errors: string[] = [];
    // 添加自定义验证逻辑
    return errors;
  }

  getOutputVariables(): string[] {
    return [`${this.id}.customOutput`];
  }
}
```

### 添加新的适配器

```typescript
import { BaseNodeAdapter } from 'agent-flow';

export class CustomAdapter extends BaseNodeAdapter {
  readonly type = 'custom';

  adapt(node: INode, context: AdaptationContext): any {
    // 实现适配逻辑
  }

  canHandle(node: INode): boolean {
    // 判断是否能处理该节点
    return true;
  }

  getExecutor(node: INode): (input: any) => Promise<any> {
    // 返回执行函数
    return async (input) => ({ result: 'executed' });
  }
}

// 注册适配器
import { AdapterFactory } from 'agent-flow';
const factory = AdapterFactory.getInstance();
factory.registerAdapter(new CustomAdapter());
```

## 🏗️ 架构设计

### 核心类图

```
┌─────────────────┐
│   IWorkflow     │
├─────────────────┤
│ + addNode()     │
│ + addEdge()     │
│ + validate()    │
│ + topologicalSort() │
└────────┬────────┘
         │
         │ implements
         ▼
┌─────────────────┐
│   Workflow      │
├─────────────────┤
│ - nodes: Map    │
│ - edges: Map    │
└─────────────────┘

┌─────────────────┐
│    INode        │
├─────────────────┤
│ + validate()    │
│ + getOutputVariables() │
└────────┬────────┘
         │
         │ extends
         ▼
┌─────────────────┐
│   BaseNode      │
├─────────────────┤
│ + id            │
│ + name          │
│ + type          │
│ + config        │
└────────┬────────┘
         │
         ├──────────────┬──────────────┐
         ▼              ▼              ▼
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│  AgentNode  │ │ ToolNode │ │ WorkflowNode │
└─────────────┘ └──────────┘ └──────────────┘

┌─────────────────┐
│ INodeAdapter    │
├─────────────────┤
│ + adapt()       │
│ + canHandle()   │
│ + getExecutor() │
└────────┬────────┘
         │
         │ extends
         ▼
┌─────────────────┐
│ BaseNodeAdapter │
├─────────────────┤
│ + resolveInput()│
│ + applyVariableMapping() │
└────────┬────────┘
         │
         │ extends
         ▼
┌─────────────────┐
│ MastraNodeAdapter │
└─────────────────┘
```

## 📝 API 文档

### Workflow

#### 构造函数

```typescript
constructor(id: string, name: string, description?: string, globalVariables?: Record<string, any>)
```

#### 方法

- `addNode(node: INode): void` - 添加节点
- `addEdge(edge: IEdge): void` - 添加边
- `validate(): ValidationResult` - 验证工作流
- `topologicalSort(): INode[]` - 拓扑排序

### VariableResolver

#### 方法

- `resolve(template: string | object): any` - 解析模板
- `setVariable(key: string, value: any): void` - 设置变量
- `extractVariables(template: string): string[]` - 提取变量
- `validateTemplate(template: string): ValidationResult` - 验证模板

### MastraCompiler

#### 构造函数

```typescript
constructor(adapterType?: string)
```

#### 方法

- `compile(workflow: IWorkflow): CompiledWorkflow` - 编译工作流

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

ISC

## 🔗 相关链接

- [Mastra 文档](https://mastra.ai)
- [TypeScript 文档](https://www.typescriptlang.org/)