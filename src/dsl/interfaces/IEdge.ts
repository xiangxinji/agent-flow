/**
 * 边接口 - 定义节点之间的连接关系
 */
export interface IEdge {
  /** 边唯一标识 */
  readonly id: string;

  /** 源节点ID */
  readonly from: string;

  /** 目标节点ID */
  readonly to: string;

  /** 边类型 */
  readonly type: EdgeType;

  /** 边条件 */
  readonly condition?: EdgeCondition;

  /** 变量映射 - 如何将源节点的输出映射到目标节点的输入 */
  readonly variableMapping?: VariableMapping;

  /** 验证边配置 */
  validate(): ValidationResult;
}

/**
 * 边类型
 */
export enum EdgeType {
  /** 顺序执行 */
  SEQUENCE = 'sequence',

  /** 条件分支 */
  CONDITIONAL = 'conditional',

  /** 并行执行 */
  PARALLEL = 'parallel'
}

/**
 * 边条件
 */
export interface EdgeCondition {
  /** 条件表达式 - 支持模板字符串 */
  expression: string;

  /** 条件评估器 */
  evaluator?: (context: any) => boolean | Promise<boolean>;
}

/**
 * 变量映射配置
 */
export interface VariableMapping {
  /** 源变量路径 -> 目标变量路径的映射 */
  [sourcePath: string]: string | VariableMappingConfig;
}

/**
 * 变量映射配置
 */
export interface VariableMappingConfig {
  /** 目标变量路径 */
  target: string;

  /** 转换函数 */
  transform?: (value: any) => any;

  /** 默认值 */
  defaultValue?: any;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}