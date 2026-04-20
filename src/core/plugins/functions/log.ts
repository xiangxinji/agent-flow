import { CommonInput, ExecutorFunction } from "../../../function/base";

export class LogFunction extends ExecutorFunction<CommonInput, void> {
    constructor() {
        super('tool.log' , '打印日志');
    }
    execute(input: CommonInput): void {
        console.log(input.input)     ;
    }
}