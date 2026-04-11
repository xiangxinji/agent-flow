import { Input } from "./input"

/**
 * 前端配置的节点类型
 */
export type GraphNodeType = 'agent' | 'branch' | 'iterator' | 'parallel' | 'subgraph' | 'function-call'


export interface Flow {
    id: string
    name: string
    version: string
    nodes: Node[]
    edges: Edge[]
    /**
     * The root node ID
     */
    root: string
}

export interface Node {
    id: string
    type: GraphNodeType
    metadata?: Record<string, any>
    attrs?: Record<string, any>
}


export interface FunctionCallNode extends Node {
    config : {
        fnName : string
        input : Record<string , Input>
    }
}



export interface ParallelNode extends Node {
    branches: Array<string>
    next?: string
}

export interface IBranchNode extends Node {
    cases: Array<{
        condition: string;
        target: string;
    }>
    next?: string
}

export interface Edge {
    from: string
    to: string
}
