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
}
export function createMastraAgent({ id, instructions }: MastraAgentConfig) {
  return new Agent({
    id,
    name: 'NodeExecutorAgent',
    instructions,
    model: 'deepseek/deepseek-chat'
  })
}
