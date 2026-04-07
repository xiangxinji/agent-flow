import { BaseExecutor } from "../workflow/executor/base";
import { AgentExecutor } from "../workflow/executor/agent";
import { GraphNodeType } from "@/interface/graph/graph";
import { FunctionExecutor } from "../workflow/executor/function";

export class ExecutorFactory {
    static create(type: GraphNodeType): BaseExecutor {
        if(type === 'agent') {
            return new AgentExecutor({});
        }
        if(type === 'function-call') {
            return new FunctionExecutor({});
        }
        throw new Error(`Unknown executor type: ${type}`);
    }
}