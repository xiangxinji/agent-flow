


import { ENGINE_STAGE } from "@/enums/engine";
import { functionRegistry } from "../../../function";
import { ExecutorNode } from "../node/executor";
import { ExecutorRuntime } from "../runtime";
import { BaseExecutor, BaseExecutorConfig } from "./base";
import { EngineStateGetter } from "@/utils/state-parser";
import { Input } from "@/interface/graph/input";

type FunctionCallExecutorConfig = Omit<{
    config: {
        fnName: string
        input: Record<string , Input>
    }
} & BaseExecutorConfig, 'type'>

export class FunctionCallExecutor extends BaseExecutor {
    private config: {
        fnName: string
        input: Record<string , Input>
    };

    constructor(config: FunctionCallExecutorConfig) {
        super({ ...config, type: 'function-call' });
        this.config = config.config;
    }

    async execute(node: ExecutorNode, runtime: ExecutorRuntime) {
        const input = EngineStateGetter.getInput<{ param : string }>(runtime.engineContext.state , this.config.input)

        
        runtime.engineContext.engine.emit(ENGINE_STAGE.FUNCTION_CALL_START, [this.config, input]);
        if (!this.config.fnName) {
            return {
            }
        }
        const output = functionRegistry.call(this.config.fnName, input.param);
        runtime.engineContext.engine.emit(ENGINE_STAGE.FUNCTION_CALL_END, [this.config, output]);
        return output
    }
}
