import { BaseNode } from "../workflow/node/base";
import { GraphNodeType, IBranchNode, INode, IParallelNode, IIteratorNode, ISubGraphNode } from "@/core/interface/graph/graph";
import { ExecutorNode } from "../workflow/node/executor";
import { BranchNode, } from "../workflow/node/branch";
import { IteratorNode } from "../workflow/node/iterator";
import { ParallelNode, ParallelNodeConfig } from "../workflow/node/parallel";
import { SubGraphNode } from "../workflow/node/subgraph";
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
        if ((['agent', 'function-call'] as GraphNodeType[]).includes(node.type as GraphNodeType)) {
            return new ExecutorNode({ ...base, executor: ExecutorFactory.create(node.type as GraphNodeType, node) });
        } else if (node.type === 'branch') {
            const _node = node as IBranchNode;
            return new BranchNode({ ...base, cases: _node.cases || [], next: _node.next || null });
        } else if (node.type === 'iterator') {
            const _node = node as IIteratorNode;
            return new IteratorNode({ ...base, iterator: _node.iterator });
        } else if (node.type === 'parallel') {
            const _node = node as IParallelNode;
            return new ParallelNode({ ...base, branches: _node.branches || [], next: _node.next || null });
        } else if (node.type === 'subgraph') {
            const _node = node as ISubGraphNode;
            return new SubGraphNode({ ...base, subgraph: _node.subgraph });
        }
        throw new Error(`Unknown node type: ${node.type}`);
    }
}
