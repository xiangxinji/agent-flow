import { Input } from "./input"

/**
 * 前端配置的节点类型
 */
export type GraphNodeType = 'agent' | 'branch' | 'iterator' | 'parallel' | 'subgraph' | 'function-call'


export interface IFlow {
    id: string
    name: string
    version: string
    nodes: INode[]
    edges: IEdge[]
    /**
     * The root node ID
     */
    root: string
}

export interface INode {
    id: string
    type: GraphNodeType
    metadata?: Record<string, any>
    attrs?: Record<string, any>
}


export interface IFunctionCallNode extends INode {
    config: {
        fnName: string
        input: Record<string, Input>
    }
}


export interface IAgentNode extends INode {
    config: {
        instructions: string
        input : {
            prompt : Input
        }
    }
}


export interface IParallelNode extends INode {
    branches: Array<string>
    next?: string
}

export interface IBranchNode extends INode {
    cases: Array<{
        condition: string;
        target: string;
    }>
    next?: string
}

export interface IEdge {
    from: string
    to: string
}
