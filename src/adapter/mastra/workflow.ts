import { MasterWorkflow } from "../../interface/workflow";
import { WorkflowInstance } from "../instance";

export class MastraAdapterWorkflowInstance extends WorkflowInstance {
    
    private json: MasterWorkflow;
    constructor (json: MasterWorkflow) {
        super();
        this.json = json;
    }

    public run(): void {
    }

}