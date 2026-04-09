import { ENGINE_STAGE } from "@/enums/engine";
import { EngineContext,  } from "../../../workflow-engine";
import { BaseExecutor } from "../executor/base";
import { BaseNode, NodeConfig } from "./base";
import { ExecutorRuntime } from "../runtime";

export type ExecutorNodeConfig = Omit<NodeConfig & {
    next?: string;
    executor: BaseExecutor
}, 'type'>;



export class ExecutorNode extends BaseNode {
    public next: string | null = null;
    public executor: BaseExecutor;

    constructor(config: ExecutorNodeConfig) {
        super({ ...config, type: 'executor' });
        this.next = config.next || null;
        this.executor = config.executor;
    }

    async onExecute(ctx: EngineContext) {
        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_BEFORE, ctx);
        const runtime = new ExecutorRuntime({ engineContext: ctx });
        const output = await this.executor.execute(this, runtime);
        ctx.state.setState(`[node-output-${this.id}]`, { output })
        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_AFTER, ctx);


        if (this.next) {
            await ctx.engine.runNode(this.next);
        }
    }
}
