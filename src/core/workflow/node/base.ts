
import { EngineContext, Input } from "../../../workflow-engine";

export type NodeType = 'executor' | 'branch' | 'iterator' | 'subgraph' | 'parallel'
export abstract class BaseNode {
    id: string;
    metadata?: Record<string, any>;
    type: NodeType;
    attrs?: Record<string, any>;
    constructor({ id, type, metadata, attrs }: NodeConfig) {
        this.id = id;
        this.type = type;
        this.metadata = metadata;
        this.attrs = attrs;
    }
    abstract onExecute (input: Input, ctx : EngineContext): Promise<any>;
}


export type NodeConfig = {
    id: string;
    type: NodeType;
    metadata?: Record<string, any>;
    attrs?: Record<string, any>;
}
