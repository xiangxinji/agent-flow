import { EngineContext } from "../engine";
import { BaseNode, NodeConfig } from "./base";
import { ENGINE_STAGE } from "@/core/enums/engine";
import { createMastraAgent } from "@/mastra";
import { EngineStateGetter } from "@/utils/state-parser";

export type IntentRecognitionNodeConfig = Omit<NodeConfig & {
    intentRecognition: {
        agent: {
            instructions: string;
            model: string;
        };
        input: {
            data: any;
        };
        intentions: Array<{
            name: string;
            target: string;
        }>;
        defaultTarget?: string;
    };
}, 'type'>;

export class IntentRecognitionNode extends BaseNode {
    public intentRecognition: {
        agent: {
            instructions: string;
            model: string;
        };
        input: {
            data: any;
        };
        intentions: Array<{
            name: string;
            target: string;
        }>;
        defaultTarget?: string;
    };

    constructor(config: IntentRecognitionNodeConfig) {
        super({ ...config, type: 'executor' });
        this.intentRecognition = {
            agent: config.intentRecognition.agent,
            input: config.intentRecognition.input,
            intentions: config.intentRecognition.intentions || [],
            defaultTarget: config.intentRecognition.defaultTarget
        };
    }

    async onExecute(ctx: EngineContext): Promise<any> {
        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_BEFORE);

        try {
            // 1. 获取输入数据
            const inputData = EngineStateGetter.getInput(ctx.engine.state.getAll(), this.intentRecognition.input.data);
            
            // 2. 使用 Agent 分析输入并识别意图
            const { instructions, model } = this.intentRecognition.agent;
            const agent = createMastraAgent({ 
                id: this.id, 
                instructions: `
${instructions}

Please analyze the input data and return ONLY the name of the recognized intent from the following list:
${this.intentRecognition.intentions.map(intention => `- ${intention.name}`).join('\n')}

If no intent matches, return "unknown".

Input data:
${JSON.stringify(inputData, null, 2)}
                `, 
                model 
            });
            
            ctx.engine.mastra.addAgent(agent);
            const response = await agent.generate(JSON.stringify(inputData));
            
            // 3. 处理 Agent 响应
            const recognizedIntent = response.text.trim().toLowerCase();
            
            // 4. 查找对应的目标节点
            let targetNodeId = this.intentRecognition.defaultTarget;
            
            for (const intention of this.intentRecognition.intentions) {
                if (recognizedIntent.includes(intention.name.toLowerCase())) {
                    targetNodeId = intention.target;
                    break;
                }
            }
            
            // 5. 路由到目标节点
            if (targetNodeId) {
                await ctx.engine.runNode(targetNodeId);
            }
            
        } catch (error) {
            console.error('Error in IntentRecognitionNode:', error);
            
            // 错误处理：使用默认目标
            if (this.intentRecognition.defaultTarget) {
                await ctx.engine.runNode(this.intentRecognition.defaultTarget);
            }
        }

        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_AFTER);
    }
}
