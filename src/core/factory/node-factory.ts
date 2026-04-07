import { BaseNode } from "../workflow/node/base";
import { GraphNodeType, Node } from "@/interface/graph/graph";
import { ExecutorNode } from "../workflow/node/executor";
import { BranchNode } from "../workflow/node/branch";
import { IteratorNode } from "../workflow/node/iterator";
import { ParallelNode } from "../workflow/node/parallel";
import { SubGraphNode } from "../workflow/node/sub-graph";
import { ExecutorFactory } from "./executor-factory";

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
        if ((['agent' , 'function-call'] as GraphNodeType[]).includes(node.type as GraphNodeType)) {
            return new ExecutorNode({ ...base , executor : ExecutorFactory.create(node.type  as GraphNodeType) });
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