import { NodeType } from "@/interface/flow/node";
import { EngineContext } from "../engine";

export abstract class BaseNode {
    id: string;
    metadata?: Record<string, any>;
    type: NodeType;
    constructor({ id, type, metadata }: NodeConfig) {
        this.id = id;
        this.type = type;
        this.metadata = metadata;
    }

    abstract whenExecute (node: BaseNode, ctx : EngineContext): Promise<any>;
}


export type NodeConfig = {
    id: string;
    type: NodeType;
    metadata?: Record<string, any>;
}
