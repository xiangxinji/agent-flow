import { WorkflowPlugin } from "@/index";
import { WorkflowEngine } from "../workflow/engine";
import { ToJsonConvertFunction } from "./tools/to-json";
import { LogFunction } from "./tools/log";
import { FetchFunction } from "./tools/fetch";



export class CommonPlugin implements WorkflowPlugin {
    name = 'common';
    description = '常用工具插件';
    tools = [new ToJsonConvertFunction(), new LogFunction(), new FetchFunction()];
    apply(engine: WorkflowEngine) {
        this.tools.forEach(func => engine.functionRegistry.register(func));
    }
}
