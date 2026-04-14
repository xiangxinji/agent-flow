import { EngineContext,  } from "../engine";
import { BaseNode, NodeConfig } from "./base";
import { ENGINE_STAGE } from "@/core/enums/engine";

export type ParallelNodeConfig = Omit<NodeConfig & {
    parallel: {
        branches?: Array<string>;
        next?: string;
    };
}, 'type'>;

export class ParallelNode extends BaseNode {
    public parallel: {
        branches: Array<string>;
        next?: string;
    };

    constructor(config: ParallelNodeConfig) {
        super({ ...config, type: 'parallel' });
        this.parallel = {
            branches: config.parallel?.branches || [],
            next: config.parallel?.next
        };
    }

    async onExecute(  ctx: EngineContext) {
        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_BEFORE);
        await Promise.all(this.parallel.branches.map(async (branch) => {
            return ctx.engine.runNode(branch);
        }));
        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_AFTER);
        if (this.parallel.next) {
            return await ctx.engine.runNode(this.parallel.next);
        }
    }
}
