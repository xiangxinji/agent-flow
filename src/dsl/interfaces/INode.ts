/**
 * 节点接口 - 所有节点类型的基础接口
 */
export interface INode {
  /** 节点唯一标识 */
  readonly id: string;

  /** 节点名称 */
  readonly name: string;

  /** 节点类型 */
  readonly type: NodeType;

  /** 节点配置 */
  readonly config: NodeConfig;

  /** 验证节点配置 */
  validate(): ValidationResult;

  /** 获取节点的输出变量 */
  getOutputVariables(): string[];

  /** 获取节点配置的 JSON 表示 */
  toJSON(): object;
}

/**
 * 节点类型枚举
 */
export enum NodeType {
  AGENT = 'agent',
  TOOL = 'tool',
  WORKFLOW = 'workflow'
}

/**
 * 节点配置
 */
export interface NodeConfig {
  /** 执行器ID */
  executorId?: string;

  /** 输入配置 - 支持模板字符串 */
  input?: Record<string, any> | string;

  /** 输出配置 */
  output?: {
    /** 输出变量映射 */
    variables?: Record<string, string>;
    /** 是否保存完整输出 */
    saveFullOutput?: boolean;
  };

  /** 重试配置 */
  retryConfig?: {
    maxRetries?: number;
    backoffMs?: number;
  };

  /** 依赖的节点ID */
  dependencies?: string[];

  /** 额外配置 */
  metadata?: Record<string, any>;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}