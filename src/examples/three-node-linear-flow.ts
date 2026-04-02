/**
 * 三节点线性流示例
 *
 * 这个示例展示了如何使用 OOP 引擎构建一个包含 3 个节点的线性工作流：
 *
 * 输入 -> [节点1: Agent] -> [节点2: Tool] -> [节点3: Workflow] -> 输出
 *
 * 节点之间的数据流转：
 * - 节点1 的输出作为节点2的输入
 * - 节点2 的输出作为节点3的输入
 * - 使用模板字符串占位符实现变量流转
 */

import {
  Workflow,
  AgentNode,
  ToolNode,
  WorkflowNode,
  Edge,
  EdgeType,
  MastraCompiler,
  VariableResolver
} from '../index';

/**
 * 创建三节点线性工作流
 */
function createThreeNodeWorkflow(): Workflow {
  // 1. 创建工作流
  const workflow = new Workflow(
    'three-node-workflow',
    '三节点线性流',
    '展示如何使用 OOP 引擎构建线性工作流',
    {
      // 全局变量
      workflowName: '三节点线性流',
      version: '1.0.0'
    }
  );

  // 2. 创建节点

  // 节点1: Agent 节点 - 接收用户输入并生成初步分析
  const agentNode = new AgentNode(
    'agent-node-1',
    '数据分析 Agent',
    {
      executorId: 'data-analyzer-agent',
      input: {
        prompt: '请分析以下数据: {{input.userQuery}}',
        context: '这是一个数据分析任务'
      },
      output: {
        variables: {
          analysisResult: 'response',
          confidence: 'usage.confidence'
        }
      }
    }
  );

  // 节点2: Tool 节点 - 处理 Agent 的分析结果
  const toolNode = new ToolNode(
    'tool-node-2',
    '数据计算工具',
    {
      executorId: 'calculator-tool',
      input: {
        // 使用模板字符串引用节点1的输出
        data: '{{agent-node-1.analysisResult}}',
        operation: 'calculate_metrics'
      },
      output: {
        variables: {
          metrics: 'result',
          calculationTime: 'executionTime'
        }
      }
    }
  );

  // 节点3: Workflow 节点 - 汇总结果并生成报告
  const workflowNode = new WorkflowNode(
    'workflow-node-3',
    '报告生成工作流',
    {
      workflow: {
        id: 'report-generation-workflow'
      },
      input: {
        // 引用节点1和节点2的输出
        analysis: '{{agent-node-1.analysisResult}}',
        metrics: '{{tool-node-2.metrics}}',
        template: 'detailed-report'
      },
      output: {
        variables: {
          finalReport: 'result',
          reportStatus: 'status'
        }
      }
    }
  );

  // 3. 添加节点到工作流
  workflow.addNode(agentNode);
  workflow.addNode(toolNode);
  workflow.addNode(workflowNode);

  // 4. 创建边（定义节点之间的连接）

  // 边1: agent-node-1 -> tool-node-2
  const edge1 = new Edge(
    'edge-1',
    'agent-node-1',
    'tool-node-2',
    EdgeType.SEQUENCE,
    undefined,
    {
      // 定义变量映射：节点1的输出如何映射到节点2的输入
      'response': 'data',
      'usage.confidence': {
        target: 'confidenceLevel',
        transform: (value: number) => value * 100, // 转换为百分比
        defaultValue: 0.95
      }
    }
  );

  // 边2: tool-node-2 -> workflow-node-3
  const edge2 = new Edge(
    'edge-2',
    'tool-node-2',
    'workflow-node-3',
    EdgeType.SEQUENCE,
    undefined,
    {
      'result': 'metrics',
      'executionTime': 'calculationDuration'
    }
  );

  // 边3: agent-node-1 -> workflow-node-3 (直接连接，也传递数据)
  const edge3 = new Edge(
    'edge-3',
    'agent-node-1',
    'workflow-node-3',
    EdgeType.SEQUENCE,
    undefined,
    {
      'response': 'analysis'
    }
  );

  // 5. 添加边到工作流
  workflow.addEdge(edge1);
  workflow.addEdge(edge2);
  workflow.addEdge(edge3);

  return workflow;
}

/**
 * 演示变量解析功能
 */
function demonstrateVariableResolver(): void {
  console.log('\n=== 演示变量解析器 ===\n');

  const resolver = new VariableResolver({
    user: {
      name: 'Alice',
      age: 30
    },
    workflow: {
      version: '1.0.0'
    }
  });

  // 解析简单变量
  const template1 = 'Hello, {{user.name}}!';
  console.log(`模板: ${template1}`);
  console.log(`结果: ${resolver.resolve(template1)}`);

  // 解析嵌套变量
  const template2 = 'Version: ${workflow.version}, User: {{user.name}} ({{user.age}} years old)';
  console.log(`\n模板: ${template2}`);
  console.log(`结果: ${resolver.resolve(template2)}`);

  // 解析对象中的模板
  const template3 = {
    greeting: 'Hello, {{user.name}}',
    info: 'Version: ${workflow.version}'
  };
  console.log('\n对象模板:');
  console.log(resolver.resolve(template3));

  // 提取变量
  const variables = resolver.extractVariables('{{user.name}} depends on ${workflow.version}');
  console.log(`\n提取的变量: ${variables.join(', ')}`);

  // 验证模板
  const validation = resolver.validateTemplate('Hello, {{user.name}} from {{company}}');
  console.log(`\n模板验证: valid=${validation.valid}, missing=${validation.missingVariables.join(', ')}`);
}

/**
 * 主函数 - 编译和执行工作流
 */
async function main(): Promise<void> {
  console.log('=== 三节点线性流示例 ===\n');

  // 1. 演示变量解析器
  demonstrateVariableResolver();

  // 2. 创建工作流
  console.log('\n=== 创建工作流 ===\n');
  const workflow = createThreeNodeWorkflow();

  // 3. 验证工作流
  console.log('验证工作流...');
  const validation = workflow.validate();
  if (!validation.isValid) {
    console.error('工作流验证失败:', validation.errors);
    return;
  }
  console.log('工作流验证成功!');

  // 4. 查看工作流结构
  console.log('\n=== 工作流结构 ===\n');
  console.log('节点列表:');
  for (const node of workflow.nodes.values()) {
    console.log(`  - ${node.id} (${node.name}): ${node.type}`);
  }

  console.log('\n边的连接:');
  for (const edge of workflow.edges.values()) {
    console.log(`  - ${edge.from} -> ${edge.to}`);
  }

  // 5. 拓扑排序
  console.log('\n执行顺序 (拓扑排序):');
  const sortedNodes = workflow.topologicalSort();
  sortedNodes.forEach((node, index) => {
    console.log(`  ${index + 1}. ${node.id} (${node.name})`);
  });

  // 6. 编译工作流
  console.log('\n=== 编译工作流 ===\n');
  const compiler = new MastraCompiler('mastra');
  const compiledWorkflow = compiler.compile(workflow);

  console.log(`编译成功! 工作流ID: ${compiledWorkflow.id}`);
  console.log(`包含 ${compiledWorkflow.steps.length} 个步骤`);

  // 7. 执行工作流
  console.log('\n=== 执行工作流 ===\n');
  const executionResult = await compiledWorkflow.execute({
    userQuery: '分析2024年销售数据趋势'
  });

  // 8. 显示执行结果
  console.log('\n=== 执行结果 ===\n');
  console.log(`成功: ${executionResult.success}`);
  console.log(`错误: ${executionResult.errors.join(', ') || '无'}`);

  console.log('\n各步骤结果:');
  for (const [stepId, result] of executionResult.stepResults) {
    console.log(`\n${stepId}:`);
    console.log(JSON.stringify(result, null, 2));
  }

  console.log('\n最终输出:');
  console.log(JSON.stringify(executionResult.output, null, 2));

  console.log('\n=== 示例完成 ===');
}

// 运行示例
if (require.main === module) {
  main().catch(console.error);
}

export { createThreeNodeWorkflow, demonstrateVariableResolver, main };