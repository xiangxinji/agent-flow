import { CommonInput, ExecutorFunction } from "../base";





export class ToJsonConvertFunction extends ExecutorFunction<CommonInput, any> {
    constructor() {
        super('data.to-json');
    }

    execute(input: CommonInput): any {
        return JSON.parse(input.param);
    }
}