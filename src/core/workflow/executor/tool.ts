



import { ENGINE_STAGE } from "@/core/enums/engine";
import { ExecutorNode } from "../node/executor";
import { ExecutorRuntime } from "../runtime";
import { BaseExecutor, BaseExecutorConfig } from "./base";
import { EngineStateGetter } from "@/utils/state-parser";
import { Input } from "@/core/interface/graph/input";
import { CommonInput } from "@/tools/base";


type ToolExecutorConfig = Omit<{
    tool: {
        name: string
        input: Record<string, Input>
    }
} & BaseExecutorConfig, 'type'>

export class ToolExecutor extends BaseExecutor {

    private tool: {
        name: string
        input: Record<string, Input>
    };

    constructor(config: ToolExecutorConfig) {
        super({ ...config, type: 'tool' });
        this.tool = config.tool;
    }

    async execute(node: ExecutorNode, runtime: ExecutorRuntime) {
        const input = EngineStateGetter.getInput<CommonInput>(runtime.engineContext.state, this.tool.input)
        runtime.engineContext.engine.emit(ENGINE_STAGE.TOOL_START, [this.tool]);
        if (!this.tool.name) {
            return {
            }
        }

        const output = runtime.engineContext.engine.functionRegistry.call(this.tool.name, input);
        runtime.engineContext.engine.emit(ENGINE_STAGE.TOOL_END, [this.tool]);
        return output
    }
}
