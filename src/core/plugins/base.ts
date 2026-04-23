import { WorkflowPlugin } from "@/index";
import { WorkflowEngine } from "../workflow/engine";
import { ToJsonConvertFunction } from "./functions/to-json";
import { LogFunction } from "./functions/log";
import { FetchFunction } from "./functions/fetch";



export class BasePlugin implements WorkflowPlugin {
    name = 'base';
    description = '预设插件';
    functions = [new ToJsonConvertFunction(), new LogFunction(), new FetchFunction()];
    apply(engine: WorkflowEngine) {
        this.functions.forEach(func => engine.functionRegistry.register(func));
    }
}
