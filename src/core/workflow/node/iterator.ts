import { EngineContext } from "../engine";
import { BaseNode, NodeConfig } from "./base";

export type IteratorNodeConfig = Omit<NodeConfig & {
    
}, 'type'>;

export class IteratorNode extends BaseNode {
    constructor(config: IteratorNodeConfig) {
        super({ ...config, type: 'iterator' });
    }
    
    whenExecute(node: BaseNode, ctx: EngineContext): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
