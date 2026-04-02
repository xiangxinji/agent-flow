import { INodeAdapter, AdaptationContext } from '../interfaces/INodeAdapter';
import { INode, NodeType } from '../../dsl/interfaces/INode';
import { IEdge, VariableMappingConfig } from '../../dsl/interfaces/IEdge';
import { VariableResolver } from '../../dsl/resolver/VariableResolver';

/**
 * 节点适配器抽象基类
 * 提供适配器的通用实现
 */
export abstract class BaseNodeAdapter<T = any> implements INodeAdapter<T> {
  abstract readonly type: string;

  /**
   * 抽象方法：将 DSL 节点转换为框架特定的执行单元
   */
  abstract adapt(node: INode, context: AdaptationContext): T;

  /**
   * 验证节点是否可以被此适配器处理
   */
  abstract canHandle(node: INode): boolean;

  /**
   * 获取适配器的执行函数
   */
  abstract getExecutor(node: INode): (input: any) => Promise<any>;

  /**
   * 解析节点输入中的变量
   */
  protected resolveInput(node: INode, context: AdaptationContext): any {
    const resolver = new VariableResolver(context.variables);

    // 添加依赖节点的输出到上下文
    if (context.dependencies) {
      for (const [nodeId, output] of Object.entries(context.dependencies)) {
        resolver.setVariable(nodeId, output);
      }
    }

    // 解析输入配置
    const inputConfig = node.config.input;
    if (inputConfig === undefined) {
      return {};
    }

    return resolver.resolve(inputConfig);
  }

  /**
   * 应用边的变量映射
   */
  protected applyVariableMapping(
    sourceOutput: any,
    edge: IEdge,
    resolver: VariableResolver
  ): any {
    if (!edge.variableMapping) {
      return sourceOutput;
    }

    const mapped: any = {};

    for (const [sourcePath, targetConfig] of Object.entries(edge.variableMapping)) {
      let targetPath: string;
      let transform: ((value: any) => any) | undefined;
      let defaultValue: any;

      if (typeof targetConfig === 'string') {
        targetPath = targetConfig;
      } else {
        const config = targetConfig as VariableMappingConfig;
        targetPath = config.target;
        transform = config.transform;
        defaultValue = config.defaultValue;
      }

      // 获取源值
      const sourceValue = this.getNestedValue(sourceOutput, sourcePath);

      // 应用转换函数
      let finalValue = sourceValue;
      if (transform && sourceValue !== undefined) {
        finalValue = transform(sourceValue);
      }

      // 使用默认值
      if (finalValue === undefined && defaultValue !== undefined) {
        finalValue = defaultValue;
      }

      // 设置目标值
      this.setNestedValue(mapped, targetPath, finalValue);
    }

    return mapped;
  }

  /**
   * 获取嵌套对象的值
   */
  protected getNestedValue(obj: any, path: string): any {
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
   * 设置嵌套对象的值
   */
  protected setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split(/[.\[\]]+/).filter(k => k !== '');

    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  /**
   * 处理节点执行结果
   */
  protected processOutput(node: INode, rawOutput: any): any {
    if (node.config.output?.variables) {
      const mapped: any = {};
      for (const [key, path] of Object.entries(node.config.output.variables)) {
        mapped[key] = this.getNestedValue(rawOutput, path);
      }
      return mapped;
    }

    if (node.config.output?.saveFullOutput) {
      return rawOutput;
    }

    // 默认返回包含节点ID的输出
    return {
      [node.id]: rawOutput
    };
  }

  /**
   * 处理重试逻辑
   */
  protected async executeWithRetry<T>(
    executor: () => Promise<T>,
    maxRetries: number = 3,
    backoffMs: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await executor();
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries) {
          // 指数退避
          const delay = backoffMs * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}