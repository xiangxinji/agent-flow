import { Flow, Node } from "@/interface/graph/graph";
import { Workflow } from "../workflow";
import { BaseNode } from "../workflow/node/base";
import { NodeFactory } from "../workflow/node-factory";

export class GraphBuilder {
    private nodeMap: Map<string, BaseNode> = new Map();

    constructor(private json: Flow) {

    }

    private buildNodes(wf: Workflow) {
        this.json.nodes.forEach(node => {
            const nodeInstance = NodeFactory.create(node);
            this.nodeMap.set(node.id, nodeInstance);
            wf.addNode(nodeInstance);
        });
    }

    private buildEdges() {
        this.json.edges.forEach(edge => {
            const fromNode = this.nodeMap.get(edge.from);
            const toNode = this.nodeMap.get(edge.to);
            if (fromNode && toNode) {
                (fromNode as any).next = edge.to;
            }
        });
    }


    public build(): Workflow {
        const wf = new Workflow({
            id: this.json.id,
            name: this.json.name,
            version: this.json.version,
            nodes: []
        });

        this.buildNodes(wf);
        this.buildEdges();
        return wf;
    }

}
