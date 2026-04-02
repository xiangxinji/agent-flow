import { WorkflowNode } from "../interface/node";


export function isBranchNode(node: WorkflowNode): boolean {
    if(node.type === 'branch') {
        return true;
    }
    return false;
}

export function isParallelNode(node: WorkflowNode): boolean {
    if(node.type === 'parallel') {
        return true;
    }
    return false;
}


export function isIteratorNode(node: WorkflowNode): boolean {
    if(node.type === 'iterator') {
        return true;
    }
    return false;
}


export function isSubGraphNode(node: WorkflowNode): boolean {
    if(node.type === 'subgraph') {
        return true;
    }
    return false;
}

export function isExecutionNode(node: WorkflowNode): boolean {
    if(node.type === 'execution') {
        return true;
    }
    return false;
}