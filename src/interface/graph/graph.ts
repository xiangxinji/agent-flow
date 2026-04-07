import { NodeType } from "../flow/node"

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
    type: NodeType
    metadata ?: Record<string, any>

}

export interface Edge {
    from: string
    to: string
}
