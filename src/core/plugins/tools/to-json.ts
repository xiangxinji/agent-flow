import { CommonInput, ToolExecutor } from "@/tools/base";

export class ToJsonConvertFunction extends ToolExecutor<CommonInput, any> {
    constructor() {
        super('data.to-json', '将字符串转换为 JSON 对象');
    }

    execute(input: CommonInput): any {
        return JSON.parse(input.input);
    }
}
