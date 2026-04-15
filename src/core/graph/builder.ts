import { IFlow, IBranchNode, INode, IParallelNode, IIteratorNode } from "@/core/interface/graph/graph";
import { Workflow } from "../workflow";
import { BaseNode } from "../workflow/node/base";
import { NodeFactory } from "../factory/node-factory";
import { ParallelNode } from "../workflow/node/parallel";
import { isBranchNode, isParallelNode } from "../../utils/builder";

export class GraphBuilder {
    private nodeMap: Map<string, BaseNode> = new Map();

    constructor(private json: IFlow) {

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

               
                /**
                 * 处理分支节点的分支
                 * @param fromNode 分支节点
                 * @param edge 边
                 */
                if (isBranchNode(fromNode)) {
                    if (fromNode.id === edge.from) {
                        (fromNode as unknown as any).branch.next = edge.to;
                    } else {
                        const from = edge.from ; 
                        const ind = (fromNode as unknown as any).branch.cases.findIndex((i: any) => i.target === from);
                        if(ind > -1) {
                            (fromNode as unknown as any).branch.cases[ind] = { ...(fromNode as unknown as any).branch.cases[ind], target: edge.to };
                        }
                    }
                    return;
                }
                (fromNode as any).next = edge.to;
            }
        });
    }


    public build(): Workflow {
        const wf = new Workflow({
            id: this.json.id,
            name: this.json.name,
            version: this.json.version,
            nodes: [],
            root: this.json.root
        });

        this.buildNodes(wf);
        this.buildEdges();

        console.log(wf.nodes);
        
        return wf;
    }

}
