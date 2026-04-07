


import { ExecutorNode } from "../node/executor";
import { Input } from "../../../workflow-engine";
import { BaseExecutor, BaseExecutorConfig } from "./base";

type AgentExecutorConfig = Omit<{
        
} & BaseExecutorConfig , 'type'>

export class AgentExecutor extends BaseExecutor {
    constructor(config: AgentExecutorConfig) {
        super({ ...config, type: 'agent' });
    }
    
    async execute(node: ExecutorNode, input: Input) {
        return {};
    }
}
