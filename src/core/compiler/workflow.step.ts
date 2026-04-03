import { WorkflowNode, HasNextNode } from "@/interface/node";
import { createStep } from "@mastra/core/workflows";
import { z } from "zod";

let num = 1;
export class MastraAdapterWorkflowStep {
    id: string;

    constructor(public node: WorkflowNode,) {
        this.id = this.node.id;
    }

    /**
     * 判断是否为执行节点
     */
    isExecutionNode() {
        return this.node.type === 'execution';
    }

    /**
     * 判断是否为分支节点
     */
    isBranchNode() {
        return this.node.type === 'branch';
    }

    /**
     * 判断是否为迭代器节点
     */
    isIteratorNode() {
        return this.node.type === 'iterator';
    }

    /**
     * 判断是否为子图节点
     */
    isSubGraphNode() {
        return this.node.type === 'subgraph';
    }

    /**
     * 判断是否为并行节点
     */
    isParallelNode() {
        return this.node.type === 'parallel';
    }

    hasNext() {
        return (this.node as HasNextNode)?.next !== undefined;
    }


    /**
     * 构建节点
     * @returns 
     */
    public create() {
        return createStep({
            id: this.node.id,
            description: 'node_' + this.node.id,
            inputSchema: z.object({}),
            outputSchema: z.object({}),
            execute: async (input) => {
                console.log('===' + num++ + '===', this.node.id);

                return input as any;
            }
        });
    }

}
