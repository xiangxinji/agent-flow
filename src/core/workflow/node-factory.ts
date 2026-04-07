import { BaseNode } from "./node/base";
import { Node } from "@/interface/graph/graph";
import { ExecutorNode } from "./node/executor";
import { BranchNode } from "./node/branch";
import { IteratorNode } from "./node/iterator";
import { ParallelNode } from "./node/parallel";
import { SubGraphNode } from "./node/sub-graph";

export class NodeFactory {
    /**
     * 根据节点类型创建节点实例
     * @param node 节点配置
     * @returns 节点实例
     */
    static create(node: Node): BaseNode {
        const id = node.id;
        const metadata = node.metadata || {};
        const base = { id, metadata };
        if (node.type === 'executor') {
            return new ExecutorNode({ ...base });
        } else if (node.type === 'branch') {
            return new BranchNode({ ...base });
        } else if (node.type === 'iterator') {
            return new IteratorNode({ ...base })
        } else if (node.type === 'parallel') {
            return new ParallelNode({ ...base })
        } else if (node.type === 'subgraph') {
            return new SubGraphNode({ ...base })
        }
        throw new Error(`Unknown node type: ${node.type}`);
    }
}