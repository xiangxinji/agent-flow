import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";



/**
 * 创建空的Mastra实例
 * @returns 
 */
export function createMastraInstance() {
  return new Mastra({
    agents: {},
  })
}


type MastraAgentConfig = {
  id: string
  instructions: string;
  model?: string;
}
export function createMastraAgent({ id, instructions, model }: MastraAgentConfig) {
  return new Agent({
    id,
    name: 'NodeExecutorAgent',
    instructions,
    model: model || 'deepseek/deepseek-chat'
  })
}
