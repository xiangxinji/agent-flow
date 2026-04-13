import { ConditionParser } from "@/utils/condition-parser";
import { EngineContext, } from "../engine";
import { BaseNode, NodeConfig } from "./base";
import { ENGINE_STAGE } from "@/core/enums/engine";

export type BranchNodeConfig = Omit<NodeConfig & {
    cases?: Array<{
        condition: string;
        target: string;
    }>;
    next: string | null;
}, 'type'>;

export class BranchNode extends BaseNode {
    public cases: Array<{
        condition: string;
        target: string;
    }>;
    public next: string | null = null;

    constructor(config: BranchNodeConfig) {
        super({ ...config, type: 'branch' });
        this.cases = config.cases || [];
        this.next = config.next || null;
    }

    async onExecute(ctx: EngineContext): Promise<any> {
        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_BEFORE);

        const cp = new ConditionParser(ctx.engine.state.getAll());

        // 遍历所有分支条件
        for (const branchCase of this.cases) {
            try {
                // 简单的条件表达式执行（实际项目中可能需要更复杂的表达式解析器）
                const conditionResult = await cp.evaluate(branchCase.condition);
                
                if (conditionResult) {
                    // 执行匹配的分支
                    await ctx.engine.runNode(branchCase.target);
                    break;
                }
            } catch (error) {
                console.error('Error evaluating branch condition:', error);
            }
        }

        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_AFTER);

        // 执行下一个节点
        if (this.next) {
            return await ctx.engine.runNode(this.next);
        }
    }

  
}
