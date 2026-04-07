import { BaseNode, NodeConfig } from "./base";

export type SubGraphNodeConfig = Omit<NodeConfig & {
    
}, 'type'>;

export class SubGraphNode extends BaseNode {
    constructor(config: SubGraphNodeConfig) {
        super({ ...config, type: 'subgraph' });
    }
}
