


import { ENGINE_STAGE } from "@/core/enums/engine";
import { functionRegistry } from "../../../function";
import { ExecutorNode } from "../node/executor";
import { ExecutorRuntime } from "../runtime";
import { BaseExecutor, BaseExecutorConfig } from "./base";
import { EngineStateGetter } from "@/utils/state-parser";
import { Input } from "@/core/interface/graph/input";
import { CommonInput } from "@/function/base";


type FunctionCallExecutorConfig = Omit<{
    function: {
        fnName: string
        input: Record<string, Input>
    }
} & BaseExecutorConfig, 'type'>

export class FunctionCallExecutor extends BaseExecutor {

    private function: {
        fnName: string
        input: Record<string, Input>
    };

    constructor(config: FunctionCallExecutorConfig) {
        super({ ...config, type: 'function-call' });
        this.function = config.function;
    }

    async execute(node: ExecutorNode, runtime: ExecutorRuntime) {
        const input = EngineStateGetter.getInput<CommonInput>(runtime.engineContext.state, this.function.input)
        runtime.engineContext.engine.emit(ENGINE_STAGE.FUNCTION_CALL_START, [this.function]);
        if (!this.function.fnName) {
            return {
            }
        }
        const output = functionRegistry.call(this.function.fnName, input);
        runtime.engineContext.engine.emit(ENGINE_STAGE.FUNCTION_CALL_END, [this.function]);
        return output
    }
}
