import { MasterWorkflow } from "../../interface/workflow";
import { MastraAdapterWorkflowInstance } from "./workflow/workflow";

export class MastraWorkflowAdapter {
    private instance: MastraAdapterWorkflowInstance;
    
    constructor(private json: MasterWorkflow) {
        this.instance = new MastraAdapterWorkflowInstance(this.json);
    }

}