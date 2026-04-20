import { CommonInput, ExecutorFunction } from "@/function/base";

export class ToJsonConvertFunction extends ExecutorFunction<CommonInput, any> {
    constructor() {
        super('data.to-json', '将字符串转换为 JSON 对象');
    }

    execute(input: CommonInput): any {
        return JSON.parse(input.input);
    }
}
