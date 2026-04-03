


import { MasterWorkflow } from "@/interface/workflow";
import { DSLWorkflowCompiler } from "../compiler";
import { WorkflowContext } from "../workflow/context";

/**
 * Mastra workflow adapter
 */
export class MastraWorkflowAdapter {

    constructor(private json: MasterWorkflow) {
    }

    private get root() {
        return this.json.startNodeId;
    }

    compile(context: WorkflowContext) {
        const compiler = new DSLWorkflowCompiler(this.json, context);
        const workflow = compiler.compile(this.root);
        return workflow;
    }
}
