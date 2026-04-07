import { EngineContext } from "../engine";
import { BaseExecutor } from "../executor/base";
import { BaseNode, NodeConfig } from "./base";

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

    async whenExecute(node: ExecutorNode , ctx: EngineContext) {
        await this.executor.execute(node);
        if (this.next) {
            await ctx.engine.runNode(this.next);
        }
    }
}
