import { BaseNode, NodeConfig } from "./base";

export type ExecutorNodeConfig = Omit<NodeConfig & {
    next?: string;
}, 'type'>;

export class ExecutorNode extends BaseNode {
    public next: string | null = null;
    constructor(config: ExecutorNodeConfig) {
        super({ ...config, type: 'executor' });
        this.next = config.next || null;
    }
}
