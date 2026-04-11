import { BaseNode } from "@/core/workflow/node/base";



export function isParallelNode(node: BaseNode) {
    return node.type === 'parallel';
}


export function isBranchNode(node: BaseNode) {
    return node.type === 'branch';
}