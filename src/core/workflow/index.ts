import { BaseNode } from "./node/base";


export type WorkflowConfig = {
    id: string;              // 流程唯一标识
    name: string;            // 流程名称
    version: string;         // DSL 版本，如 "1.0.0"
    nodes: BaseNode[];
    root: string;

}

export class Workflow {
    id: string;              // 流程唯一标识
    name: string;            // 流程名称
    version: string;         // DSL 版本，如 "1.0.0"
    nodes: BaseNode[];
    root: string;

    constructor({ id, name, version, nodes, root }: WorkflowConfig) {
        this.id = id;
        this.name = name;
        this.version = version;
        this.nodes = nodes;
        this.root = root;
    }

    /**
     * Add a node to the workflow
     * @param node The node to add
     */
    addNode(node: BaseNode): void {
        this.nodes.push(node);
    }

    /**
     * Get a node by ID
     * @param nodeId The ID of the node to retrieve
     * @returns The node if found, undefined otherwise
     */
    getNode(nodeId: string): BaseNode | undefined {
        return this.nodes.find(node => node.id === nodeId);
    }

    /**
     * Check if a node exists in the workflow
     * @param nodeId The ID of the node to check
     * @returns true if the node exists, false otherwise
     */
    hasNode(nodeId: string): boolean {
        return this.nodes.some(node => node.id === nodeId);
    }

    /**
     * Get all nodes of a specific type
     * @param type The type of nodes to retrieve
     * @returns Array of nodes of the specified type
     */
    getNodesByType(type: string): BaseNode[] {
        return this.nodes.filter(node => node.type === type);
    }

    /**
     * Remove a node from the workflow
     * @param nodeId The ID of the node to remove
     * @returns true if the node was removed, false if it wasn't found
     */
    removeNode(nodeId: string): boolean {
        const index = this.nodes.findIndex(node => node.id === nodeId);
        if (index !== -1) {
            this.nodes.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Get the total number of nodes in the workflow
     */
    get nodeCount(): number {
        return this.nodes.length;
    }

}
