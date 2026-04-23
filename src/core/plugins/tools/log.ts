import { CommonInput, ToolExecutor } from "../../../tools/base";

export class LogFunction extends ToolExecutor<CommonInput, void> {
    constructor() {
        super('tool.log' , '打印日志');
    }
    execute(input: CommonInput): void {
        console.log(input.input)     ;
    }
}