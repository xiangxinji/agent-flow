import { INode } from './INode';
import { IEdge } from './IEdge';

// 重新导出接口
export { INode } from './INode';
export { IEdge } from './IEdge';

/**
 * 工作流定义接口
 */
export interface IWorkflow {
  /** 工作流ID */
  readonly id: string;

  /** 工作流名称 */
  readonly name: string;

  /** 工作流描述 */
  readonly description?: string;

  /** 工作流节点 */
  readonly nodes: Map<string, INode>;

  /** 工作流边 */
  readonly edges: Map<string, IEdge>;

  /** 全局变量 */
  readonly globalVariables?: Record<string, any>;

  /** 添加节点 */
  addNode(node: INode): void;

  /** 添加边 */
  addEdge(edge: IEdge): void;

  /** 获取节点 */
  getNode(id: string): INode | undefined;

  /** 获取边 */
  getEdge(id: string): IEdge | undefined;

  /** 获取节点的出边 */
  getOutgoingEdges(nodeId: string): IEdge[];

  /** 获取节点的入边 */
  getIncomingEdges(nodeId: string): IEdge[];

  /** 验证工作流 */
  validate(): ValidationResult;

  /** 获取起始节点（没有入边的节点） */
  getStartNodes(): INode[];

  /** 拓扑排序 */
  topologicalSort(): INode[];
}

/**
 * 验证结果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}