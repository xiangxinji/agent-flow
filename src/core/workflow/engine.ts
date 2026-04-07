
import { Workflow } from "../workflow";
import { BaseNode } from "./node/base";




export type Input = Record<string, any>;

export type EngineContext = {
    engine: WorkflowEngine
    node: BaseNode
}


export class WorkflowEngine {

    constructor(private workflow: Workflow) { }

    public async runNode(id: string, input: Input = {}) {
        if (!id) {
            return;
        }
        const node = this.workflow.getNode(id);
        if (!node) {
            throw new Error(`Node ${id} not found`);
        }

        const context: EngineContext = {
            engine: this,
            node: node,
        };
         await node.onExecute(input, context);

    }

    public async run(input : Input = {}) {
        const root = this.workflow.getNode(this.workflow.root);
        if (!root) {
            throw new Error(`Root node ${this.workflow.root} not found`);
        }
        return await this.runNode(this.workflow.root, input);
    }
}
