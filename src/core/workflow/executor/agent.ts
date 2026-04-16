


import { createMastraAgent } from "@/mastra";
import { ExecutorNode } from "../node/executor";
import { ExecutorRuntime } from "../runtime";
import { BaseExecutor, BaseExecutorConfig } from "./base";
import { Input } from "@/core/interface/graph/input";
import { EngineStateGetter } from "@/utils/state-parser";

type AgentExecutorConfig = Omit<{
    agent: {
        instructions: string
        input: {
            prompt: Input
        }
    }
} & BaseExecutorConfig, 'type'>



export class AgentExecutor extends BaseExecutor {
    private agent: {
        instructions: string
        input: {
            prompt: Input
        }
    }
    constructor(config: AgentExecutorConfig) {
        super({ ...config, type: 'agent' });
        this.agent = config.agent;
    }

    async execute(node: ExecutorNode, runtime: ExecutorRuntime) {
        const { instructions, input } = this.agent;
        const agent = createMastraAgent({ id: node.id, instructions });
        runtime.engineContext.engine.mastra.addAgent(agent);
        const _input = EngineStateGetter.getInput<{ prompt: string }>(runtime.engineContext.state, input);
        const response = await agent.generate(_input.prompt);
        return { text: response.text };
    }
}
