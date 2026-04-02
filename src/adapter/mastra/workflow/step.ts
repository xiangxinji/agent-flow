import { WorkflowNode, ExecutionNode, BranchNode, IteratorNode, SubGraphNode, ParallelNode } from "../../../interface/node";
import { InstanceContext } from "./index";

export class MastraAdapterWorkflowStep {
    constructor(private context: InstanceContext , private node: WorkflowNode, ) {

    }

    /**
     * 判断是否为执行节点
     */
    private isExecutionNode() {
        return this.node.type === 'execution';
    }

    /**
     * 判断是否为分支节点
     */
    private isBranchNode() {
        return this.node.type === 'branch';
    }

    /**
     * 判断是否为迭代器节点
     */
    private isIteratorNode() {
        return this.node.type === 'iterator';
    }

    /**
     * 判断是否为子图节点
     */
    private isSubGraphNode() {
        return this.node.type === 'subgraph';
    }

    /**
     * 判断是否为并行节点
     */
    private isParallelNode() {
        return this.node.type === 'parallel';
    }


    public build () {
        return () => {
            
        }
    }
  
}
