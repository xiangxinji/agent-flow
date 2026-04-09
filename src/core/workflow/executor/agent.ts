


import { ExecutorNode } from "../node/executor";
import { ExecutorRuntime } from "../runtime";
import { BaseExecutor, BaseExecutorConfig } from "./base";

type AgentExecutorConfig = Omit<{
} & BaseExecutorConfig, 'type'>

export class AgentExecutor extends BaseExecutor {
    constructor(config: AgentExecutorConfig) {
        super({ ...config, type: 'agent' });
    }

    async execute(node: ExecutorNode, runtime : ExecutorRuntime ) {
        return {};
    }
}
