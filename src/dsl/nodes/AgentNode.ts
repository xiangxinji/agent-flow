import { BaseNode } from './BaseNode';
import { NodeType, NodeConfig, ValidationResult } from '../interfaces/INode';

/**
 * Agent 节点配置接口
 */
export interface AgentNodeConfig extends NodeConfig {
  /** Agent 配置 */
  agent?: {
    /** Agent ID 或名称 */
    id?: string;
    /** Agent 提示词模板 */
    promptTemplate?: string;
    /** Agent 温度参数 */
    temperature?: number;
    /** Agent 最大tokens */
    maxTokens?: number;
  };
}

/**
 * Agent 节点 - 表示一个 AI Agent 执行节点
 */
export class AgentNode extends BaseNode {
  readonly type = NodeType.AGENT;
  readonly config: AgentNodeConfig;

  constructor(id: string, name: string, config: AgentNodeConfig = {}) {
    super(id, name, NodeType.AGENT, config);
    this.config = config;
  }

  /**
   * 自定义验证逻辑
   */
  protected validateCustom(): string[] {
    const errors: string[] = [];

    // Agent 节点必须有 executorId 或 agent.id
    if (!this.config.executorId && !this.config.agent?.id) {
      errors.push('Agent 节点必须指定 executorId 或 agent.id');
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
      `${this.id}.response`,
      `${this.id}.reasoning`,
      `${this.id}.usage`
    ];
  }

  /**
   * 获取 Agent 配置
   */
  getAgentConfig(): AgentNodeConfig['agent'] {
    return this.config.agent;
  }
}