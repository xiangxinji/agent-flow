import { BaseNode } from "../workflow/node/base";
import { GraphNodeType, IBranchNode, INode, IParallelNode, IIteratorNode,  } from "@/core/interface/graph/graph";
import { ExecutorNode } from "../workflow/node/executor";
import { BranchNode, } from "../workflow/node/branch";
import { IteratorNode } from "../workflow/node/iterator";
import { ParallelNode, ParallelNodeConfig } from "../workflow/node/parallel";
import { ExecutorFactory } from "./executor-factory";

export class NodeFactory {
    /**
     * 根据节点类型创建节点实例
     * @param node 节点配置
     * @returns 节点实例
     */
    static create(node: INode): BaseNode {
        const id = node.id;
        const metadata = node.metadata || {};
        const attrs = node.attrs || {};
        const base = { id, metadata, attrs };
        if ((['agent', 'function-call' , 'intent-recognition'] as GraphNodeType[]).includes(node.type as GraphNodeType)) {
            return new ExecutorNode({ ...base, executor: ExecutorFactory.create(node.type as GraphNodeType, node) });
        } else if (node.type === 'branch') {
            const _node = node as IBranchNode;
            return new BranchNode({ ...base, branch: _node.branch });
        } else if (node.type === 'iterator') {
            const _node = node as IIteratorNode;
            return new IteratorNode({ ...base, iterator: _node.iterator });
        } else if (node.type === 'parallel') {
            const _node = node as IParallelNode;
            return new ParallelNode({ ...base, parallel: _node.parallel });
        } 
        throw new Error(`Unknown node type: ${node.type}`);
    }
}
