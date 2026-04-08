import { ExecutorFunction } from "../base";

export class LogFunction extends ExecutorFunction<string, string> {
    constructor() {
        super('tool.log');
    }
    execute(input: string): string {
        console.log(input);
        return input
    }
}