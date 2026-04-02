/**
 * 变量解析器 - 实现变量流转机制
 * 支持模板字符串占位符的解析和替换
 */
export class VariableResolver {
  private context: Record<string, any>;
  private cache: Map<string, any>;

  constructor(context: Record<string, any> = {}) {
    this.context = context;
    this.cache = new Map();
  }

  /**
   * 设置上下文变量
   */
  setContext(context: Record<string, any>): void {
    this.context = { ...this.context, ...context };
    this.cache.clear(); // 清除缓存
  }

  /**
   * 更新上下文中的单个变量
   */
  setVariable(key: string, value: any): void {
    this.context[key] = value;
    this.cache.delete(key); // 清除该变量的缓存
  }

  /**
   * 获取上下文中的变量值
   */
  getVariable(key: string): any {
    return this.getNestedValue(this.context, key);
  }

  /**
   * 解析模板字符串
   * 支持 {{variable}} 和 ${variable} 两种格式
   */
  resolve(template: string | object): any {
    if (typeof template === 'string') {
      return this.resolveString(template);
    } else if (typeof template === 'object' && template !== null) {
      return this.resolveObject(template);
    }
    return template;
  }

  /**
   * 解析对象中的模板
   */
  resolveObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.resolve(item));
    }

    if (typeof obj === 'object' && obj !== null) {
      const resolved: any = {};
      for (const [key, value] of Object.entries(obj)) {
        resolved[key] = this.resolve(value as string | object);
      }
      return resolved;
    }

    return obj;
  }

  /**
   * 解析字符串模板
   */
  private resolveString(template: string): string {
    // 检查缓存
    if (this.cache.has(template)) {
      return this.cache.get(template);
    }

    let result = template;

    // 解析 {{variable}} 格式
    result = result.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
      const trimmedKey = key.trim();
      const value = this.getNestedValue(this.context, trimmedKey);
      return this.valueToString(value);
    });

    // 解析 ${variable} 格式
    result = result.replace(/\$\{([^}]+)\}/g, (match, key) => {
      const trimmedKey = key.trim();
      const value = this.getNestedValue(this.context, trimmedKey);
      return this.valueToString(value);
    });

    // 缓存结果
    this.cache.set(template, result);
    return result;
  }

  /**
   * 获取嵌套对象的值
   * 支持 "user.name", "data[0].value" 等路径
   */
  private getNestedValue(obj: any, path: string): any {
    const keys = path.split(/[.\[\]]+/).filter(k => k !== '');

    let current = obj;
    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[key];
    }

    return current;
  }

  /**
   * 将值转换为字符串
   */
  private valueToString(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    return String(value);
  }

  /**
   * 检查模板中是否包含变量引用
   */
  hasVariables(template: string): boolean {
    return /\{\{[^}]+\}\}/.test(template) || /\$\{[^}]+\}/.test(template);
  }

  /**
   * 提取模板中的所有变量名
   */
  extractVariables(template: string): string[] {
    const variables: string[] = [];
    const pattern = /\{\{([^}]+)\}\}|\$\{([^}]+)\}/g;
    let match;

    while ((match = pattern.exec(template)) !== null) {
      const variable = match[1] || match[2];
      if (variable) {
        variables.push(variable.trim());
      }
    }

    return [...new Set(variables)]; // 去重
  }

  /**
   * 验证模板中的变量是否都在上下文中存在
   */
  validateTemplate(template: string): { valid: boolean; missingVariables: string[] } {
    const variables = this.extractVariables(template);
    const missingVariables: string[] = [];

    for (const variable of variables) {
      if (this.getNestedValue(this.context, variable) === undefined) {
        missingVariables.push(variable);
      }
    }

    return {
      valid: missingVariables.length === 0,
      missingVariables
    };
  }

  /**
   * 创建变量解析器的快照
   */
  snapshot(): Record<string, any> {
    return { ...this.context };
  }

  /**
   * 从快照恢复变量解析器状态
   */
  restore(snapshot: Record<string, any>): void {
    this.context = snapshot;
    this.cache.clear();
  }

  /**
   * 清除所有上下文和缓存
   */
  clear(): void {
    this.context = {};
    this.cache.clear();
  }
}