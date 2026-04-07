


import { Input } from "../../../workflow-engine";
import { ExecutorNode } from "../node/executor";
import { BaseExecutor, BaseExecutorConfig } from "./base";

type FunctionCallExecutorConfig = Omit<{

} & BaseExecutorConfig, 'type'>

export class FunctionCallExecutor extends BaseExecutor {
    constructor(config: FunctionCallExecutorConfig) {
        super({ ...config, type: 'function-call' });
    }
    
    async execute(node: ExecutorNode , input : Input) {
        return {
            ...input ,
            ['node-id'] : node.id
        };
    }   
}
