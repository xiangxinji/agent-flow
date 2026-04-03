import { expressionParser } from "../parser/expression";

export class WorkflowContext {
    private context: any = {};



    constructor() {
    }

    public set(key: string, value: any) {
        this.context[key] = value;
    }

    public get(key: string) {
        return this.context[key];
    }

 

}
