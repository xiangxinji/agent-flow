import { CommonInput, ExecutorFunction } from "../base";

export class LogFunction extends ExecutorFunction<CommonInput, void> {
    constructor() {
        super('tool.log');
    }
    execute(input: CommonInput): void {
        console.log(input.param);
    }
}