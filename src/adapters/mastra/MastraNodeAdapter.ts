import { BaseNodeAdapter } from '../base/BaseNodeAdapter';
import { INode, NodeType } from '../../dsl/interfaces/INode';
import { VariableResolver } from '../../dsl/resolver/VariableResolver';
import { AdaptationContext } from '../interfaces/INodeAdapter';

/**
 * Mastra Step 接口
 * 模拟 Mastra 的 Step 接口
 */
interface MastraStep {
  id: string;
  execute: (input: any) => Promise<any>;
}

/**
 * Mastra 节点适配器 - 将 DSL 节点转换为 Mastra Step
 */
export class MastraNodeAdapter extends BaseNodeAdapter<MastraStep> {
  readonly type = 'mastra';

  /**
   * 将 DSL 节点转换为 Mastra Step
   */
  adapt(node: INode, context: AdaptationContext): MastraStep {
    const executor = this.getExecutor(node);

    return {
      id: node.id,
      execute: async (input: any) => {
        // 解析输入变量
        const resolvedInput = this.resolveInput(node, context);

        // 合并运行时输入和解析后的输入
        const finalInput = {
          ...resolvedInput,
          ...input
        };

        // 执行节点
        const rawOutput = await this.executeWithRetry(
          () => executor(finalInput),
          node.config.retryConfig?.maxRetries || 3,
          node.config.retryConfig?.backoffMs || 1000
        );

        // 处理输出
        return this.processOutput(node, rawOutput);
      }
    };
  }

  /**
   * 验证节点是否可以被此适配器处理
   */
  canHandle(node: INode): boolean {
    // Mastra 适配器可以处理所有类型的节点
    return true;
  }

  /**
   * 获取适配器的执行函数
   */
  getExecutor(node: INode): (input: any) => Promise<any> {
    switch (node.type) {
      case NodeType.AGENT:
        return this.getAgentExecutor(node);
      case NodeType.TOOL:
        return this.getToolExecutor(node);
      case NodeType.WORKFLOW:
        return this.getWorkflowExecutor(node);
      default:
        throw new Error(`不支持的节点类型: ${node.type}`);
    }
  }

  /**
   * 获取 Agent 执行器
   */
  private getAgentExecutor(node: INode): (input: any) => Promise<any> {
    return async (input: any) => {
      const executorId = node.config.executorId;

      if (!executorId) {
        throw new Error(`Agent 节点 ${node.id} 缺少 executorId`);
      }

      // 这里应该调用实际的 Agent 执行器
      // 为了示例，我们返回模拟数据
      console.log(`执行 Agent ${node.id} (executor: ${executorId})`);

      return {
        response: `Agent ${node.id} 的执行结果`,
        reasoning: '执行推理过程',
        usage: {
          promptTokens: 100,
          completionTokens: 50,
          totalTokens: 150
        }
      };
    };
  }

  /**
   * 获取 Tool 执行器
   */
  private getToolExecutor(node: INode): (input: any) => Promise<any> {
    return async (input: any) => {
      const executorId = node.config.executorId;

      if (!executorId) {
        throw new Error(`Tool 节点 ${node.id} 缺少 executorId`);
      }

      console.log(`执行 Tool ${node.id} (executor: ${executorId})`);

      return {
        result: `Tool ${node.id} 的执行结果`,
        executionTime: 100
      };
    };
  }

  /**
   * 获取 Workflow 执行器
   */
  private getWorkflowExecutor(node: INode): (input: any) => Promise<any> {
    return async (input: any) => {
      const workflowId = (node.config as any).workflow?.id;

      if (!workflowId) {
        throw new Error(`Workflow 节点 ${node.id} 缺少 workflow.id`);
      }

      console.log(`执行 Workflow ${node.id} (workflow: ${workflowId})`);

      return {
        result: `Workflow ${node.id} 的执行结果`,
        status: 'completed'
      };
    };
  }
}