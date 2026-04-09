import { WorkflowEngine } from ".";

export interface WorkflowHistoryItem {
    stage: string
    log: string
}

export class WorkflowHistory {
    histories: WorkflowHistoryItem[] = []
    constructor(private engine: WorkflowEngine) {

    }

    put(stage: string, data : Record<string, any>) {
        this.histories.push({
            stage,
            log : JSON.stringify(data)
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
