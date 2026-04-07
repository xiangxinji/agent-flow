import { BaseNode, NodeConfig } from "./base";

export type IteratorNodeConfig = Omit<NodeConfig & {
    
}, 'type'>;

export class IteratorNode extends BaseNode {
    constructor(config: IteratorNodeConfig) {
        super({ ...config, type: 'iterator' });
    }
}
