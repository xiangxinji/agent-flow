import { INodeAdapter } from '../interfaces/INodeAdapter';
import { MastraNodeAdapter } from '../mastra/MastraNodeAdapter';
import { INode } from '../../dsl/interfaces/INode';

/**
 * 适配器工厂 - 负责创建和管理节点适配器
 */
export class AdapterFactory {
  private static instance: AdapterFactory;
  private adapters: Map<string, INodeAdapter> = new Map();

  private constructor() {
    // 注册默认适配器
    this.registerAdapter(new MastraNodeAdapter());
  }

  /**
   * 获取工厂单例
   */
  static getInstance(): AdapterFactory {
    if (!AdapterFactory.instance) {
      AdapterFactory.instance = new AdapterFactory();
    }
    return AdapterFactory.instance;
  }

  /**
   * 注册适配器
   */
  registerAdapter(adapter: INodeAdapter): void {
    this.adapters.set(adapter.type, adapter);
  }

  /**
   * 获取指定类型的适配器
   */
  getAdapter(type: string): INodeAdapter | undefined {
    return this.adapters.get(type);
  }

  /**
   * 为节点查找合适的适配器
   */
  findAdapterForNode(node: INode, adapterType?: string): INodeAdapter {
    // 如果指定了适配器类型，直接返回
    if (adapterType) {
      const adapter = this.adapters.get(adapterType);
      if (adapter && adapter.canHandle(node)) {
        return adapter;
      }
      throw new Error(`找不到类型为 ${adapterType} 的适配器，或者它无法处理节点 ${node.id}`);
    }

    // 遍历所有适配器，找到第一个可以处理该节点的适配器
    for (const adapter of this.adapters.values()) {
      if (adapter.canHandle(node)) {
        return adapter;
      }
    }

    throw new Error(`找不到可以处理节点 ${node.id} (${node.type}) 的适配器`);
  }

  /**
   * 获取所有已注册的适配器类型
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * 清除所有适配器
   */
  clear(): void {
    this.adapters.clear();
  }
}