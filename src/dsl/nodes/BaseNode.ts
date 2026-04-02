import { INode, NodeType, NodeConfig, ValidationResult } from '../interfaces/INode';

/**
 * 节点抽象基类
 * 提供节点的通用实现
 */
export abstract class BaseNode implements INode {
  readonly id: string;
  readonly name: string;
  readonly type: NodeType;
  readonly config: NodeConfig;

  constructor(id: string, name: string, type: NodeType, config: NodeConfig = {}) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.config = config;
  }

  /**
   * 验证节点配置
   */
  validate(): ValidationResult {
    const errors: string[] = [];

    // 验证 ID
    if (!this.id || this.id.trim() === '') {
      errors.push('节点 ID 不能为空');
    }

    // 验证名称
    if (!this.name || this.name.trim() === '') {
      errors.push('节点名称不能为空');
    }

    // 验证输入配置
    if (this.config.input !== undefined) {
      if (typeof this.config.input === 'string') {
        // 模板字符串验证
        if (!this.isValidTemplate(this.config.input)) {
          errors.push('输入模板字符串格式无效');
        }
      } else if (typeof this.config.input === 'object') {
        // 验证对象中的模板字符串
        for (const [key, value] of Object.entries(this.config.input)) {
          if (typeof value === 'string' && !this.isValidTemplate(value)) {
            errors.push(`输入配置中的 "${key}" 字段包含无效的模板字符串`);
          }
        }
      }
    }

    // 子类可以重写此方法添加额外的验证逻辑
    const customErrors = this.validateCustom();
    errors.push(...customErrors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 子类可以重写此方法添加自定义验证逻辑
   */
  protected validateCustom(): string[] {
    return [];
  }

  /**
   * 获取节点的输出变量
   * 子类应该重写此方法以返回实际的输出变量
   */
  getOutputVariables(): string[] {
    if (this.config.output?.variables) {
      return Object.values(this.config.output.variables);
    }
    return [`${this.id}.output`];
  }

  /**
   * 获取节点配置的 JSON 表示
   */
  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      config: this.config
    };
  }

  /**
   * 验证模板字符串格式
   * 支持 {{variable}} 和 ${variable} 两种格式
   */
  private isValidTemplate(template: string): boolean {
    // 简单的验证：检查模板字符串的配对
    const doubleBraceCount = (template.match(/\{\{/g) || []).length;
    const doubleBraceCloseCount = (template.match(/\}\}/g) || []).length;
    const dollarBraceCount = (template.match(/\$\{/g) || []).length;
    const dollarBraceCloseCount = (template.match(/\}/g) || []).length;

    return doubleBraceCount === doubleBraceCloseCount &&
           dollarBraceCount <= dollarBraceCloseCount;
  }
}