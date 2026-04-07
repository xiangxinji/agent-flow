
import { EngineState } from "./state";
import { Workflow } from "../core/workflow";
import { BaseNode } from "../core/workflow/node/base";




export type Input = Record<string, any>;

export type EngineContext = {
    engine: WorkflowEngine
    node: BaseNode
    state: EngineState
}

export class WorkflowEngine {

    state : EngineState 

    constructor(private workflow: Workflow) { 
        this.state = new EngineState();
    }

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
            state: this.state,
        };
         await node.onExecute(input, context);

    }

    public async run(input : Input = {}) {
        const root = this.workflow.getNode(this.workflow.root);
        if (!root) {
            throw new Error(`Root node ${this.workflow.root} not found`);
        }

        this.state.allSet(input);
        return await this.runNode(this.workflow.root, input);
    }
}
