import { MasterWorkflow } from "../../../interface/workflow";
import { WorkflowInstance } from "../../instance";
import { MastraAdapterWorkflowStep } from "./step";

export type InstanceContext = {
    workflow: MastraAdapterWorkflowInstance;
}

export class MastraAdapterWorkflowInstance extends WorkflowInstance {

    private json: MasterWorkflow;
    private steps: MastraAdapterWorkflowStep[];

    constructor(json: MasterWorkflow) {
        super();
        this.json = json;
        this.init();
    }

    private getContext(): InstanceContext {
        return {
            workflow: this
        };
    }


    private buildSteps() {
        this.steps = [];
        this.json.nodes.forEach((node) => {
            this.steps.push(new MastraAdapterWorkflowStep(this.getContext(), node));
        });
    }


    private init() {
        this.buildSteps();
    }





    public run(): void {
    }

}