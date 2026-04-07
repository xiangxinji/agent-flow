import { EngineContext, Input } from "../../../workflow-engine";
import { BaseNode, NodeConfig } from "./base";

export type ParallelNodeConfig = Omit<NodeConfig & {
    
}, 'type'>;

export class ParallelNode extends BaseNode {
    constructor(config: ParallelNodeConfig) {
        super({ ...config, type: 'parallel' });
    }
    
    onExecute(input: Input, ctx: EngineContext): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
