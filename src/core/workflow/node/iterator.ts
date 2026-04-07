import { EngineContext, Input } from "../../../workflow-engine/workflow";
import { BaseNode, NodeConfig } from "./base";

export type IteratorNodeConfig = Omit<NodeConfig & {
    
}, 'type'>;

export class IteratorNode extends BaseNode {
    constructor(config: IteratorNodeConfig) {
        super({ ...config, type: 'iterator' });
    }
    
    onExecute(input: Input, ctx: EngineContext): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
