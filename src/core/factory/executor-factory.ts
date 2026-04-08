import { BaseExecutor } from "../workflow/executor/base";
import { AgentExecutor } from "../workflow/executor/agent";
import { FunctionCallNode, GraphNodeType } from "@/interface/graph/graph";
import { FunctionCallExecutor } from "../workflow/executor/function-call";
import { BaseNode } from "@/interface/flow/node";

export class ExecutorFactory {
    static create(type: GraphNodeType, node: BaseNode): BaseExecutor {
        if (type === 'agent') {
            return new AgentExecutor({});
        }
        if (type === 'function-call') {
            return new FunctionCallExecutor({ config: (node as FunctionCallNode).config });
        }
        throw new Error(`Unknown executor type: ${type}`);
    }
}