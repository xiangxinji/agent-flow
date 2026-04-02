import { IWorkflow, INode, IEdge, ValidationResult } from '../interfaces/IWorkflow';
import { ValidationResult as NodeValidationResult } from '../interfaces/INode';

/**
 * 工作流实现类
 */
export class Workflow implements IWorkflow {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly nodes: Map<string, INode>;
  readonly edges: Map<string, IEdge>;
  readonly globalVariables?: Record<string, any>;

  constructor(
    id: string,
    name: string,
    description?: string,
    globalVariables?: Record<string, any>
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.nodes = new Map();
    this.edges = new Map();
    this.globalVariables = globalVariables;
  }

  /**
   * 添加节点
   */
  addNode(node: INode): void {
    if (this.nodes.has(node.id)) {
      throw new Error(`节点 ID ${node.id} 已存在`);
    }
    this.nodes.set(node.id, node);
  }

  /**
   * 添加边
   */
  addEdge(edge: IEdge): void {
    if (this.edges.has(edge.id)) {
      throw new Error(`边 ID ${edge.id} 已存在`);
    }

    // 验证源节点和目标节点是否存在
    if (!this.nodes.has(edge.from)) {
      throw new Error(`源节点 ${edge.from} 不存在`);
    }
    if (!this.nodes.has(edge.to)) {
      throw new Error(`目标节点 ${edge.to} 不存在`);
    }

    this.edges.set(edge.id, edge);
  }

  /**
   * 获取节点
   */
  getNode(id: string): INode | undefined {
    return this.nodes.get(id);
  }

  /**
   * 获取边
   */
  getEdge(id: string): IEdge | undefined {
    return this.edges.get(id);
  }

  /**
   * 获取节点的出边
   */
  getOutgoingEdges(nodeId: string): IEdge[] {
    return Array.from(this.edges.values()).filter(edge => edge.from === nodeId);
  }

  /**
   * 获取节点的入边
   */
  getIncomingEdges(nodeId: string): IEdge[] {
    return Array.from(this.edges.values()).filter(edge => edge.to === nodeId);
  }

  /**
   * 验证工作流
   */
  validate(): ValidationResult {
    const errors: string[] = [];

    // 验证至少有一个节点
    if (this.nodes.size === 0) {
      errors.push('工作流必须至少包含一个节点');
    }

    // 验证所有节点
    for (const node of this.nodes.values()) {
      const nodeValidation = node.validate();
      if (!nodeValidation.isValid) {
        errors.push(`节点 ${node.id} 验证失败: ${nodeValidation.errors.join(', ')}`);
      }
    }

    // 验证所有边
    for (const edge of this.edges.values()) {
      const edgeValidation = edge.validate();
      if (!edgeValidation.isValid) {
        errors.push(`边 ${edge.id} 验证失败: ${edgeValidation.errors.join(', ')}`);
      }
    }

    // 验证是否有起始节点
    const startNodes = this.getStartNodes();
    if (startNodes.length === 0 && this.nodes.size > 0) {
      errors.push('工作流没有起始节点（所有节点都有入边）');
    }

    // 验证是否有循环依赖
    const sortedNodes = this.topologicalSort();
    if (sortedNodes.length !== this.nodes.size) {
      errors.push('工作流存在循环依赖');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 获取起始节点（没有入边的节点）
   */
  getStartNodes(): INode[] {
    const nodeIdsWithIncomingEdges = new Set(
      Array.from(this.edges.values()).map(edge => edge.to)
    );

    return Array.from(this.nodes.values()).filter(
      node => !nodeIdsWithIncomingEdges.has(node.id)
    );
  }

  /**
   * 拓扑排序 - 返回节点的执行顺序
   */
  topologicalSort(): INode[] {
    const sorted: INode[] = [];
    const visited = new Set<string>();
    const temp = new Set<string>();

    const visit = (nodeId: string): void => {
      if (temp.has(nodeId)) {
        // 检测到循环
        return;
      }
      if (visited.has(nodeId)) {
        return;
      }

      temp.add(nodeId);

      const outgoingEdges = this.getOutgoingEdges(nodeId);
      for (const edge of outgoingEdges) {
        visit(edge.to);
      }

      temp.delete(nodeId);
      visited.add(nodeId);

      const node = this.getNode(nodeId);
      if (node) {
        sorted.push(node);
      }
    };

    for (const nodeId of this.nodes.keys()) {
      if (!visited.has(nodeId)) {
        visit(nodeId);
      }
    }

    return sorted.reverse();
  }

  /**
   * 创建工作流的快照
   */
  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      globalVariables: this.globalVariables,
      nodes: Array.from(this.nodes.values()).map(node => node.toJSON()),
      edges: Array.from(this.edges.values())
    };
  }
}