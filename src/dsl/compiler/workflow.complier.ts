import { Workflow } from "@mastra/core";
import { WorkflowEdge } from "../edge/edge";
import { MastraNode } from "../node/base.node";

export class MastraWorkflowCompiler {
    private nodes: Map<string, MastraNode> = new Map();
    private edges: WorkflowEdge[] = [];

    addNode(node: MastraNode) {
        this.nodes.set(node.id, node);
        return this;
    }

    addEdge(sourceId: string, targetId: string, condition?: string) {
        this.edges.push(new WorkflowEdge(sourceId, targetId, condition));
        return this;
    }

    // 核心编译方法
    compile(workflowName: string) {
   

    }
}