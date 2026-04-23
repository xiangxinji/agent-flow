export type GraphNodeType = 'agent' | 'branch' | 'iterator' | 'parallel' | 'tool' | 'intent-recognition'

export interface NodeTypeInfo {
  type: GraphNodeType
  label: string
  icon: string
  color: string
  description: string
  configSchema: Record<string, any>
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface IFlow {
  id: string
  name: string
  version: string
  nodes: INode[]
  edges: IEdge[]
  root: string
}

export interface INode {
  id: string
  type: GraphNodeType
  metadata?: Record<string, any>
  attrs?: Record<string, any>
}

export interface IToolNode extends INode {
  tool: {
    name: string
    input: Record<string, Input>
  }
}

export interface IAgentNode extends INode {
  agent: {
    instructions: string
    model: string
    input: {
      prompt: Input
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
      condition: string
      target: string
    }>
    next?: string
  }
}

export interface IIteratorNode extends INode {
  iterator: {
    array: Input
    itemKey?: string
    indexKey?: string
    target: string
    next?: string
    parallel?: boolean
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
  }
}

export interface IEdge {
  from: string
  to: string
}

export type Input = string | { $ref: string } | { $input: string }
