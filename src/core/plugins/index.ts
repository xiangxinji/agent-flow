import { ToolExecutor } from "@/tools/base";
import { WorkflowEngine } from "../workflow/engine";

export abstract class WorkflowPlugin {
    abstract name: string;
    abstract description: string;
    abstract tools: ToolExecutor<any, any>[];

    abstract apply(engine: WorkflowEngine): void;

}