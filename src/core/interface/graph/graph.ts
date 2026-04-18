import { Input } from "./input"

/**
 * 前端配置的节点类型
 */
export type GraphNodeType = 'agent' | 'branch' | 'iterator' | 'parallel' | 'function-call' | 'intent-recognition'


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
    function: {
        fnName: string
        input: Record<string, Input>
    }
}


export interface IAgentNode extends INode {
    agent: {
        instructions: string
        model: string
        input : {
            prompt : Input
        }
    }
}


export interface IParallelNode extends INode {
    parallel: {
        branches: Array<string>
        next?: string
    }
}


export interface IBranchNode extends INode {
    branch: {
        cases: Array<{
            condition: string;
            target: string;
        }>
        next?: string
    }
}

export interface IIteratorNode extends INode {
    iterator: {
        array: Input;              // 要迭代的数组数据源
        itemKey?: string;          // 当前元素存储键名，默认 'item'
        indexKey?: string;         // 当前索引存储键名，默认 'index'
        target: string;            // 要迭代的子节点 ID
        next?: string;             // 迭代完成后的下一个节点
        parallel?: boolean;        // 是否并行处理（高级特性）
    }
}

export interface IIntentRecognitionNode extends INode {
    intentRecognition: {
        agent: {
            instructions: string
            model: string
        }
        input: {
            data: Input
        }
        intentions: Array<{
            name: string
            target: string
        }>
        defaultTarget?: string
        outputKey?: string
    }
}



export interface IEdge {
    from: string
    to: string
}
