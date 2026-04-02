/**
 * 基础用法示例
 *
 * 演示如何创建一个简单的工作流并执行
 */

import {
  Workflow,
  AgentNode,
  ToolNode,
  Edge,
  EdgeType,
  MastraCompiler,
  VariableResolver,
  NodeType
} from '../index';

/**
 * 创建一个简单的工作流
 */
function createSimpleWorkflow(): Workflow {
  const workflow = new Workflow(
    'simple-workflow',
    '简单工作流示例',
    '展示基本用法'
  );

  // 创建两个节点
  const agentNode = new AgentNode(
    'agent-1',
    '问答 Agent',
    {
      executorId: 'qa-agent',
      input: {
        question: '{{input.question}}',
        context: '你是一个专业的问答助手'
      }
    }
  );

  const toolNode = new ToolNode(
    'tool-1',
    '文本处理工具',
    {
      executorId: 'text-processor',
      input: {
        // 使用模板字符串引用前一个节点的输出
        text: '{{agent-1.response}}',
        operation: 'summarize'
      }
    }
  );

  // 添加节点
  workflow.addNode(agentNode);
  workflow.addNode(toolNode);

  // 创建连接
  const edge = new Edge(
    'edge-1',
    'agent-1',
    'tool-1',
    EdgeType.SEQUENCE,
    undefined,
    {
      'response': 'text',
      'usage.totalTokens': 'inputTokens'
    }
  );

  workflow.addEdge(edge);

  return workflow;
}

/**
 * 运行示例
 */
async function runExample(): Promise<void> {
  console.log('=== 基础用法示例 ===\n');

  // 1. 创建工作流
  const workflow = createSimpleWorkflow();

  // 2. 验证
  const validation = workflow.validate();
  if (!validation.isValid) {
    console.error('验证失败:', validation.errors);
    return;
  }
  console.log('工作流验证通过!');

  // 3. 查看工作流信息
  console.log('\n工作流信息:');
  console.log(`  ID: ${workflow.id}`);
  console.log(`  名称: ${workflow.name}`);
  console.log(`  节点数: ${workflow.nodes.size}`);
  console.log(`  边数: ${workflow.edges.size}`);

  // 4. 编译并执行
  const compiler = new MastraCompiler();
  const compiled = compiler.compile(workflow);

  console.log('\n开始执行工作流...\n');
  const result = await compiled.execute({
    question: '什么是人工智能?'
  });

  // 5. 显示结果
  console.log('\n执行结果:');
  console.log(`  成功: ${result.success}`);
  console.log(`  完成的步骤: ${result.stepResults.size}`);

  console.log('\n各步骤输出:');
  for (const [stepId, output] of result.stepResults) {
    console.log(`\n  ${stepId}:`);
    console.log(`    ${JSON.stringify(output, null, 2).split('\n').join('\n    ')}`);
  }

  console.log('\n=== 示例完成 ===');
}

// 运行
if (require.main === module) {
  runExample().catch(console.error);
}

export { createSimpleWorkflow, runExample };