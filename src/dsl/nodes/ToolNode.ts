import { BaseNode } from './BaseNode';
import { NodeType, NodeConfig, ValidationResult } from '../interfaces/INode';

/**
 * Tool 节点配置接口
 */
export interface ToolNodeConfig extends NodeConfig {
  /** Tool 配置 */
  tool?: {
    /** Tool ID 或名称 */
    id?: string;
    /** Tool 参数 */
    parameters?: Record<string, any>;
    /** Tool 执行超时时间 (ms) */
    timeout?: number;
  };
}

/**
 * Tool 节点 - 表示一个工具执行节点
 */
export class ToolNode extends BaseNode {
  readonly type = NodeType.TOOL;
  readonly config: ToolNodeConfig;

  constructor(id: string, name: string, config: ToolNodeConfig = {}) {
    super(id, name, NodeType.TOOL, config);
    this.config = config;
  }

  /**
   * 自定义验证逻辑
   */
  protected validateCustom(): string[] {
    const errors: string[] = [];

    // Tool 节点必须有 executorId 或 tool.id
    if (!this.config.executorId && !this.config.tool?.id) {
      errors.push('Tool 节点必须指定 executorId 或 tool.id');
    }

    return errors;
  }

  /**
   * 获取输出变量
   */
  getOutputVariables(): string[] {
    if (this.config.output?.variables) {
      return Object.values(this.config.output.variables);
    }
    return [
      `${this.id}.result`,
      `${this.id}.error`,
      `${this.id}.executionTime`
    ];
  }

  /**
   * 获取 Tool 配置
   */
  getToolConfig(): ToolNodeConfig['tool'] {
    return this.config.tool;
  }
}