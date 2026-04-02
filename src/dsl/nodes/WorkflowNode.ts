import { BaseNode } from './BaseNode';
import { NodeType, NodeConfig } from '../interfaces/INode';

/**
 * Workflow 节点配置接口
 */
export interface WorkflowNodeConfig extends NodeConfig {
  /** 子工作流配置 */
  workflow?: {
    /** 子工作流 ID */
    id?: string;
    /** 子工作流输入映射 */
    inputMapping?: Record<string, string>;
    /** 子工作流输出映射 */
    outputMapping?: Record<string, string>;
  };
}

/**
 * Workflow 节点 - 表示一个嵌套的子工作流
 */
export class WorkflowNode extends BaseNode {
  readonly type = NodeType.WORKFLOW;
  readonly config: WorkflowNodeConfig;

  constructor(id: string, name: string, config: WorkflowNodeConfig = {}) {
    super(id, name, NodeType.WORKFLOW, config);
    this.config = config;
  }

  /**
   * 获取输出变量
   */
  getOutputVariables(): string[] {
    if (this.config.output?.variables) {
      return Object.values(this.config.output.variables);
    }

    const baseVars = [
      `${this.id}.result`,
      `${this.id}.status`
    ];

    // 如果有输出映射，添加映射后的变量
    if (this.config.workflow?.outputMapping) {
      baseVars.push(...Object.keys(this.config.workflow.outputMapping));
    }

    return baseVars;
  }

  /**
   * 获取子工作流配置
   */
  getWorkflowConfig(): WorkflowNodeConfig['workflow'] {
    return this.config.workflow;
  }
}