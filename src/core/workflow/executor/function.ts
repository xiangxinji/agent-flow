


import { ExecutorNode } from "../node/executor";
import { BaseExecutor, BaseExecutorConfig } from "./base";

type FunctionExecutorConfig = Omit<{

} & BaseExecutorConfig, 'type'>

export class FunctionExecutor extends BaseExecutor {
    constructor(config: FunctionExecutorConfig) {
        super({ ...config, type: 'function-call' });
    }
    
    async execute(node: ExecutorNode) {
        
    }   
}
