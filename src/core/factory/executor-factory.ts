import { BaseExecutor } from "../workflow/executor/base";
import { AgentExecutor } from "../workflow/executor/agent";
import { IAgentNode, IFunctionCallNode, GraphNodeType, INode } from "@/core/interface/graph/graph";
import { FunctionCallExecutor } from "../workflow/executor/function-call";

export class ExecutorFactory {
    static create(type: GraphNodeType, node: INode): BaseExecutor {
        if (type === 'agent') {
            return new AgentExecutor({ agent: (node as IAgentNode).agent });
        }
        if (type === 'function-call') {
            return new FunctionCallExecutor({ function: (node as IFunctionCallNode).function });
        }
        throw new Error(`Unknown executor type: ${type}`);
    }
}
