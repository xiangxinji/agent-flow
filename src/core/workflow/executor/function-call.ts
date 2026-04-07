


import { Input } from "../../../workflow-engine/workflow";
import { ExecutorNode } from "../node/executor";
import { BaseExecutor, BaseExecutorConfig } from "./base";

type FunctionCallExecutorConfig = Omit<{

} & BaseExecutorConfig, 'type'>

export class FunctionCallExecutor extends BaseExecutor {
    constructor(config: FunctionCallExecutorConfig) {
        super({ ...config, type: 'function-call' });
    }
    
    async execute(node: ExecutorNode , input : Input) {
        console.log('input ' , input);
        
        return {
            result: 'success :' + node.id 
        };
    }   
}
