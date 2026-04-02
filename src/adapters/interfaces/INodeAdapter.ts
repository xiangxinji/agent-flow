import { INode } from '../../dsl/interfaces/INode';
import { IEdge } from '../../dsl/interfaces/IEdge';

/**
 * 节点适配器接口 - 将 DSL 节点转换为特定框架的执行单元
 */
export interface INodeAdapter<T = any> {
  /** 适配器类型 */
  readonly type: string;

  /**
   * 将 DSL 节点转换为框架特定的执行单元
   */
  adapt(node: INode, context: AdaptationContext): T;

  /**
   * 验证节点是否可以被此适配器处理
   */
  canHandle(node: INode): boolean;

  /**
   * 获取适配器的执行函数
   */
  getExecutor(node: INode): ExecutorFunction;
}

/**
 * 适配上下文
 */
export interface AdaptationContext {
  /** 变量上下文 */
  variables: Record<string, any>;

  /** 全局配置 */
  globalConfig?: Record<string, any>;

  /** 依赖的节点输出 */
  dependencies?: Record<string, any>;

  /** 边配置（变量映射） */
  edgeConfigs?: Map<string, IEdge>;
}

/**
 * 执行函数类型
 */
export type ExecutorFunction = (input: any) => Promise<any> | any;