import { IFlow, IBranchNode, INode, IParallelNode } from "@/core/interface/graph/graph";
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

            // 处理并行节点的分支 , 并将分支节点的主节点添加到节点映射中
            if (node.type === 'parallel') {
                (node as IParallelNode).branches.forEach(i => {
                    this.nodeMap.set(i, nodeInstance);
                })
            }
            if (node.type === 'branch') {
                (node as IBranchNode).cases.forEach(i => {
                    this.nodeMap.set(i.target, nodeInstance);
                })
            }
            wf.addNode(nodeInstance);
        });
    }

    private buildEdges() {
        this.json.edges.forEach(edge => {
            const fromNode = this.nodeMap.get(edge.from);
            const toNode = this.nodeMap.get(edge.to);
            if (fromNode && toNode) {

                /**
                 * 处理并行节点的分支
                 * @param fromNode 并行节点
                 * @param edge 边
                 */
                if (isParallelNode(fromNode)) {
                    if (fromNode.id === edge.from) {
                        (fromNode as unknown as ParallelNode).next = edge.to;
                    } else {
                        const from = edge.from ; 
                        const ind = (fromNode as unknown as ParallelNode).branches.indexOf(from);
                        if(ind > -1) {
                            (fromNode as unknown as ParallelNode).branches[ind] = edge.to;
                        }
                    }
                    return;
                }
                /**
                 * 处理分支节点的分支
                 * @param fromNode 分支节点
                 * @param edge 边
                 */
                if (isBranchNode(fromNode)) {
                    if (fromNode.id === edge.from) {
                        (fromNode as unknown as IBranchNode).next = edge.to;
                    } else {
                        const from = edge.from ; 
                        const ind = (fromNode as unknown as IBranchNode).cases.findIndex(i => i.target === from);
                        if(ind > -1) {
                            (fromNode as unknown as IBranchNode).cases[ind] = { ...(fromNode as unknown as IBranchNode).cases[ind], target: edge.to };
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
