// Agent 执行器
export interface AgentExecutor {
  type: 'agent';
  agentId: string; // 引用全局定义的 Agent
  userPrompt: string; // 支持模板字符串，如 "请分析以下内容：{{context.data}}"
  overrides?: {
    systemPrompt?: string;
    model?: string;
  };
}

// 纯函数/脚本执行器 (处理数据清洗、格式转换)
export interface FunctionExecutor {
  type: 'function';
  handler: (input: any) => Promise<any> | any; // 如果是纯 JSON DSL，这里改为指向外部文件的 path
}
