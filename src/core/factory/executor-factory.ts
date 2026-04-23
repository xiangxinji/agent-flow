import { BaseExecutor } from "../workflow/executor/base";
import { AgentExecutor } from "../workflow/executor/agent";
import { IAgentNode, IToolNode, IIntentRecognitionNode, GraphNodeType, INode } from "@/core/interface/graph/graph";
import { ToolExecutor } from "../workflow/executor/tool";
import { IntentRecognitionExecutor } from "../workflow/executor/intent-recognition";

export class ExecutorFactory {
    static create(type: GraphNodeType, node: INode): BaseExecutor {
        if (type === 'agent') {
            return new AgentExecutor({ agent: (node as IAgentNode).agent });
        }
        if (type === 'tool') {
            return new ToolExecutor({ tool: (node as IToolNode).tool });
        }
        if (type === 'intent-recognition') {
            return new IntentRecognitionExecutor({ intentRecognition: (node as IIntentRecognitionNode).intentRecognition });
        }
        throw new Error(`Unknown executor type: ${type}`);
    }
}
