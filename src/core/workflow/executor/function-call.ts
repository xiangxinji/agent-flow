


import { functionRegistry } from "../../../function";
import { ExecutorNode } from "../node/executor";
import { ExecutorRuntime } from "../runtime";
import { BaseExecutor, BaseExecutorConfig } from "./base";

type FunctionCallExecutorConfig = Omit<{
    config : {
        fnName : string
        inputKey : string
    }
} & BaseExecutorConfig, 'type'>

export class FunctionCallExecutor extends BaseExecutor {
    private config: {
        fnName : string
        inputKey : string
    };

    constructor(config: FunctionCallExecutorConfig) {
        super({ ...config, type: 'function-call' });
        this.config = config.config;
    }

    async execute(node: ExecutorNode, runtime: ExecutorRuntime) {
        const input = runtime.input[this.config.inputKey];
        if(!this.config.fnName) {
            return {
            }
        }
        const result = functionRegistry.call(this.config.fnName, input);
        return {
            ...runtime.input,
            result
        };
    }
}
