import { EngineContext } from "../engine";
import { BaseNode, NodeConfig } from "./base";

export type ParallelNodeConfig = Omit<NodeConfig & {
    
}, 'type'>;

export class ParallelNode extends BaseNode {
    constructor(config: ParallelNodeConfig) {
        super({ ...config, type: 'parallel' });
    }
    
    whenExecute(node: BaseNode, ctx: EngineContext): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
