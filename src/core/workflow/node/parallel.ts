import { EngineContext,  } from "../../../workflow-engine";
import { BaseNode, NodeConfig } from "./base";
import { ENGINE_STAGE } from "@/enums/engine";

export type ParallelNodeConfig = Omit<NodeConfig & {
    branches?: Array<string>;
    next?: string
}, 'type'>;

export class ParallelNode extends BaseNode {
    public branches: Array<string>;
    public next: string | null = null;

    constructor(config: ParallelNodeConfig) {
        super({ ...config, type: 'parallel' });
        this.branches = config.branches || [];
        this.next = config.next || null;
    }

    async onExecute(  ctx: EngineContext) {
        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_BEFORE, ctx);
        await Promise.all(this.branches.map(async (branch) => {
            return ctx.engine.runNode(branch);
        }));
        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_AFTER, ctx);
        if (this.next) {
            return await ctx.engine.runNode(this.next);
        }
    }
}
