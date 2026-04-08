import { WorkflowEngine } from ".";

export interface WorkflowHistoryItem {
    stage: string
    args: Array<any>
}

export class WorkflowHistory {


    histories: WorkflowHistoryItem[] = []

    constructor(private engine: WorkflowEngine) {

    }

    put(stage: string, args: Array<any>) {
        this.histories.push({
            stage,
            args
        });
    }


    getHistories() {
        return {
            workflow: {
                id: this.engine.workflow.id,
                name: this.engine.workflow.name,
                version: this.engine.workflow.version
            },
            histories: this.histories
        }
    }
}
