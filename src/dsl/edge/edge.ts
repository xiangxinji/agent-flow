import { IEdge, EdgeType, EdgeCondition, VariableMapping, ValidationResult } from '../interfaces/IEdge';
import { VariableResolver } from '../resolver/VariableResolver';

/**
 * 边实现类 - 定义节点之间的连接
 */
export class Edge implements IEdge {
  readonly id: string;
  readonly from: string;
  readonly to: string;
  readonly type: EdgeType;
  readonly condition?: EdgeCondition;
  readonly variableMapping?: VariableMapping;

  constructor(
    id: string,
    from: string,
    to: string,
    type: EdgeType = EdgeType.SEQUENCE,
    condition?: EdgeCondition,
    variableMapping?: VariableMapping
  ) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.type = type;
    this.condition = condition;
    this.variableMapping = variableMapping;
  }

  /**
   * 验证边配置
   */
  validate(): ValidationResult {
    const errors: string[] = [];

    // 验证 ID
    if (!this.id || this.id.trim() === '') {
      errors.push('边 ID 不能为空');
    }

    // 验证源节点
    if (!this.from || this.from.trim() === '') {
      errors.push('源节点 ID 不能为空');
    }

    // 验证目标节点
    if (!this.to || this.to.trim() === '') {
      errors.push('目标节点 ID 不能为空');
    }

    // 验证不能自环
    if (this.from === this.to) {
      errors.push('边不能形成自环');
    }

    // 验证条件边必须有条件
    if (this.type === EdgeType.CONDITIONAL && !this.condition) {
      errors.push('条件边必须指定条件');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 评估条件
   */
  async evaluateCondition(context: any): Promise<boolean> {
    if (!this.condition) {
      return true; // 没有条件默认为 true
    }

    if (this.condition.evaluator) {
      return await this.condition.evaluator(context);
    }

    // 默认条件评估 - 简单的模板字符串替换和评估
    const resolver = new (require('../resolver/VariableResolver')).VariableResolver(context);
    const resolved = resolver.resolve(this.condition.expression);

    // 尝试将结果解析为布尔值
    if (typeof resolved === 'boolean') {
      return resolved;
    }

    if (typeof resolved === 'string') {
      return resolved.toLowerCase() === 'true';
    }

    return Boolean(resolved);
  }

  /**
   * 获取边的 JSON 表示
   */
  toJSON(): object {
    return {
      id: this.id,
      from: this.from,
      to: this.to,
      type: this.type,
      condition: this.condition,
      variableMapping: this.variableMapping
    };
  }
}