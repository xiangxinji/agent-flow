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

export interface ISubGraphNode extends INode {
    subgraph: {
        workflowId: string;        // 子工作流的 ID
        inputMapping?: Record<string, Input>;  // 输入参数映射
        outputMapping?: Record<string, string>; // 输出结果映射
        next?: string;             // 子工作流完成后的下一个节点
        inheritState?: boolean;    // 是否继承父工作流的状态（默认 false）
        onError?: 'continue' | 'stop'; // 错误处理策略
    }
}

export interface IEdge {
    from: string
    to: string
}
