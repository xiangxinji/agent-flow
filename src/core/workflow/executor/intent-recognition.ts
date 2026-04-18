import { ExecutorNode } from "../node/executor";
import { ExecutorRuntime } from "../runtime";
import { BaseExecutor, BaseExecutorConfig } from "./base";
import { Input } from "@/core/interface/graph/input";
import { EngineStateGetter } from "@/utils/state-parser";
import { createMastraAgent } from "@/mastra";

type IntentRecognitionExecutorConfig = Omit<{
    intentRecognition: {
        agent: {
            instructions: string;
            model: string;
        };
        input: {
            data: Input;
        };
        intentions: Array<{
            name: string;
            target: string;
        }>;
        defaultTarget?: string;
        outputKey?: string;
    };
} & BaseExecutorConfig, 'type'>;

export class IntentRecognitionExecutor extends BaseExecutor {
    private config: {
        agent: {
            instructions: string;
            model: string;
        };
        input: {
            data: Input;
        };
        intentions: Array<{
            name: string;
            target: string;
        }>;
        defaultTarget?: string;
        outputKey?: string;
    };

    constructor(config: IntentRecognitionExecutorConfig) {
        super({ ...config, type: 'intent-recognition' });
        this.config = config.intentRecognition;
    }

    async execute(node: ExecutorNode, runtime: ExecutorRuntime): Promise<Record<string, any>> {
        try {
            // 1. 获取输入数据
            const inputData = EngineStateGetter.getInput(runtime.engineContext.state, this.config.input.data);
            
            // 2. 使用 Agent 分析输入并识别意图
            const { instructions, model } = this.config.agent;
            const agent = createMastraAgent({ 
                id: node.id, 
                instructions: `
${instructions}

Please analyze the input data and return ONLY the name of the recognized intent from the following list:
${this.config.intentions.map(intention => `- ${intention.name}`).join('\n')}

If no intent matches, return "unknown".

Input data:
${JSON.stringify(inputData, null, 2)}
                `, 
                model 
            });
            
            runtime.engineContext.engine.mastra.addAgent(agent);
            const response = await agent.generate(JSON.stringify(inputData));
            
            // 3. 处理 Agent 响应
            const recognizedIntent = response.text.trim().toLowerCase();
            
            // 4. 查找对应的目标节点
            let targetNodeId = this.config.defaultTarget;
            
            for (const intention of this.config.intentions) {
                if (recognizedIntent.includes(intention.name.toLowerCase())) {
                    targetNodeId = intention.target;
                    break;
                }
            }
            
            // 5. 存储意图识别结果
            const outputKey = this.config.outputKey || 'intentResult';
            const result = {
                intent: recognizedIntent,
                target: targetNodeId,
                timestamp: new Date().toISOString()
            };
            
            runtime.engineContext.state.set(outputKey, result);
            
            // 6. 返回结果
            return {
                [outputKey]: result,
                target: targetNodeId
            };
            
        } catch (error) {
            console.error('Error in IntentRecognitionExecutor:', error);
            
            // 错误处理：返回错误信息
            return {
                error: error.message,
                target: this.config.defaultTarget
            };
        }
    }
}
