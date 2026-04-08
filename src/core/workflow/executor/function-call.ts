


import { ENGINE_STAGE } from "@/enums/engine";
import { functionRegistry } from "../../../function";
import { ExecutorNode } from "../node/executor";
import { ExecutorRuntime } from "../runtime";
import { BaseExecutor, BaseExecutorConfig } from "./base";

type FunctionCallExecutorConfig = Omit<{
    config: {
        fnName: string
        inputKey: string
    }
} & BaseExecutorConfig, 'type'>

export class FunctionCallExecutor extends BaseExecutor {
    private config: {
        fnName: string
        inputKey: string
    };

    constructor(config: FunctionCallExecutorConfig) {
        super({ ...config, type: 'function-call' });
        this.config = config.config;
    }

    async execute(node: ExecutorNode, runtime: ExecutorRuntime) {

        console.log(runtime.input);

        const input = runtime.input[this.config.inputKey];

        runtime.engineContext.engine.emit(ENGINE_STAGE.FUNCTION_CALL_START, [this.config, input]);

        if (!this.config.fnName) {
            return {
            }
        }
        const output = functionRegistry.call(this.config.fnName, input);
        runtime.engineContext.engine.emit(ENGINE_STAGE.FUNCTION_CALL_END, [this.config, output]);

        return output
    }
}
