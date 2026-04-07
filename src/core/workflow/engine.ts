
import { Workflow } from "../workflow";



export type EngineContext = {
    engine : WorkflowEngine
}


export class WorkflowEngine {
 
    constructor (private workflow: Workflow) {
        
    }

    public async runNode (nodeId: string) {
        if(!nodeId) {
            return;
        }
        
        const node = this.workflow.getNode(nodeId);
        if (!node) {
            throw new Error(`Node ${nodeId} not found`);
        }
        
        const context: EngineContext = {
            engine : this 
        };
        await node.whenExecute(node , context);
    }

    public async run() {
        const root = this.workflow.getNode(this.workflow.root);
        if (!root) {
            throw new Error(`Root node ${this.workflow.root} not found`);
        }
        await this.runNode(this.workflow.root);
    }
}
