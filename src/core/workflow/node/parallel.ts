import { result } from "lodash";
import { EngineContext, Input } from "../../../workflow-engine";
import { BaseNode, NodeConfig } from "./base";

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

    async onExecute(input: Input, ctx: EngineContext) {

        await Promise.all(this.branches.map(async (branch) => {
            return ctx.engine.runNode(branch, input);
        }));

        if (this.next) {
            return await ctx.engine.runNode(this.next, input);
        }
    }
}
