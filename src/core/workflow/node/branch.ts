import { BaseNode, NodeConfig } from "./base";

export type BranchNodeConfig = Omit<NodeConfig & {
    
}, 'type'>;

export class BranchNode extends BaseNode {
    constructor(config: BranchNodeConfig) {
        super({ ...config, type: 'branch' });
    }
}
