import { BaseExecutor } from "../workflow/executor/base";
import { AgentExecutor } from "../workflow/executor/agent";
import { GraphNodeType } from "@/interface/graph/graph";
import { FunctionCallExecutor } from "../workflow/executor/function-call";

export class ExecutorFactory {
    static create(type: GraphNodeType): BaseExecutor {
        if(type === 'agent') {
            return new AgentExecutor({});
        }
        if(type === 'function-call') {
            return new FunctionCallExecutor({});
        }
        throw new Error(`Unknown executor type: ${type}`);
    }
}