/**
 * 事件管理器
 * 提供事件订阅和发布功能
 */
export class EventManager {
  // 事件监听器映射
  private listeners: Map<string, Set<Function>> = new Map();

  /**
   * 订阅事件
   * @param event 事件名称
   * @param listener 事件监听器
   * @returns 取消订阅的函数
   */
  on(event: string, listener: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const eventListeners = this.listeners.get(event)!;
    eventListeners.add(listener);

    // 返回取消订阅的函数
    return () => {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  /**
   * 发布事件
   * @param event 事件名称
   * @param args 事件参数
   */
  emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * 清除所有事件监听器
   */
  clear(): void {
    this.listeners.clear();
  }

  /**
   * 清除指定事件的所有监听器
   * @param event 事件名称
   */
  clearEvent(event: string): void {
    this.listeners.delete(event);
  }

  /**
   * 获取指定事件的监听器数量
   * @param event 事件名称
   * @returns 监听器数量
   */
  listenerCount(event: string): number {
    const eventListeners = this.listeners.get(event);
    return eventListeners ? eventListeners.size : 0;
  }

  /**
   * 获取所有已注册的事件名称
   * @returns 事件名称数组
   */
  getEvents(): string[] {
    return Array.from(this.listeners.keys());
  }
}

// 导出单例实例
export const eventManager = new EventManager();