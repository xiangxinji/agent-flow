import { MasterWorkflow } from "../../interface/workflow";
import { MastraAdapterWorkflowInstance } from "./workflow/index";

export class MastraWorkflowAdapter {
     instance: MastraAdapterWorkflowInstance;
    
    constructor(private json: MasterWorkflow) {
        this.instance = new MastraAdapterWorkflowInstance(this.json);
    }

}