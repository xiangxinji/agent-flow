import { ExecutorFunction } from "../base";


export class ToJsonConvertFunction extends ExecutorFunction<string, any> {
    constructor() {
        super('data.to-json');
    }

    execute(input: string): any {
        return JSON.parse(input);
    }
}