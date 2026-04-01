import { Agent } from '@mastra/core/agent';

export class AgentNode {
  constructor(
    public id: string,
    private config: {
      role: string;
      model: string;
      systemPrompt: string;
      tools: string[];
    }
  ) {}

  // 转换为 Mastra 的 Step 逻辑
  toStep() {
    return {
      id: this.id,
      execute: async ({ context }: any) => {
        // 这里模拟 Mastra Agent 的执行调用
        const agent = new Agent({
          name: this.config.role,
          instructions: this.config.systemPrompt,
          model: this.config.model,
        });
        
        // 执行并返回结果
        const result = await agent.generate(context.query);
        return result.text;
      }
    };
  }
}
