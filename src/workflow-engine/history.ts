import { WorkflowEngine } from ".";

export interface WorkflowHistoryItem {
    nodeId: string;
    input: any;
    output: any;
    error?: any;
}

export class WorkflowHistory {
    
    
    histories: WorkflowHistoryItem[] = []

    constructor (private engine : WorkflowEngine) {

    }

    put () {
    }
}
