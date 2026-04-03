
import { MasterWorkflow } from "@/interface/workflow";
import { MastraAdapterWorkflowStep } from "../compiler/workflow.step";

export class StepManager {
    private stepMap: Record<string, MastraAdapterWorkflowStep> = {};


    constructor(private json: MasterWorkflow) {
        const stepMap: Record<string, any> = {};

        json.nodes.forEach((node) => {
            stepMap[node.id] = new MastraAdapterWorkflowStep(node);
        });

        this.stepMap = stepMap;
    }

    public getStep(id: string): MastraAdapterWorkflowStep | undefined {
        return this.stepMap[id];
    }

    public hasStep(id: string): boolean {
        return this.stepMap[id] !== undefined;
    }
}
