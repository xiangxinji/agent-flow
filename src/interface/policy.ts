export interface ExecutionPolicy {
  // 1. 重试机制 (应对 LLM 抖动)
  retry?: {
    attempts: number;         // 最大重试次数
    backoff: 'fixed' | 'exponential'; // 避让算法
    interval: number;         // 基础间隔时间 (ms)
    maxInterval?: number;     // 最大间隔限制
  };

  // 2. 超时控制 (防止 Node 挂起)
  timeout?: number;           // 单位 ms

  // 3. 错误处理策略 (核心逻辑)
  onError: {
    action: 'abort' | 'continue' | 'retry' | 'fallback';
    // 当 action 为 fallback 时，执行该节点的输出作为替代结果
    fallbackValue?: any;
    // 是否抛出异常给全局
    silent?: boolean;
  };

  // 4. 并发控制 (如果该 Node 涉及批量处理)
  concurrency?: number;

  // 5. 缓存策略 (节省成本和提速)
  cache?: {
    ttl: number;              // 缓存有效时长
    useCache: boolean;        // 是否优先读缓存
  };
}