import { EngineContext } from "../engine";
import { BaseNode, NodeConfig } from "./base";

export type SubGraphNodeConfig = Omit<NodeConfig & {
    
}, 'type'>;

export class SubGraphNode extends BaseNode {
    constructor(config: SubGraphNodeConfig) {
        super({ ...config, type: 'subgraph' });
    }
    
    whenExecute(node: BaseNode, ctx: EngineContext): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
