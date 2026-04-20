import { ExecutorFunction } from "@/function/base";
import { WorkflowEngine } from "../workflow/engine";

export abstract class FlowPlugin {
    abstract name: string;
    abstract description: string;
    abstract functions: ExecutorFunction<any, any>[];

    abstract apply(engine: WorkflowEngine): void;

}