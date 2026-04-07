import { BaseNode, NodeConfig } from "./base";

export type ParallelNodeConfig = Omit<NodeConfig & {
    
}, 'type'>;

export class ParallelNode extends BaseNode {
    constructor(config: ParallelNodeConfig) {
        super({ ...config, type: 'parallel' });
    }
}
