import { EngineContext } from "../engine";
import { BaseNode, NodeConfig } from "./base";
import { ISubGraphNode } from "@/core/interface/graph/graph";
import { ENGINE_STAGE } from "@/core/enums/engine";

export type SubGraphNodeConfig = Omit<NodeConfig & {
    subgraph: ISubGraphNode['subgraph'];
}, 'type'>;

export class SubGraphNode extends BaseNode {
    public subgraph: ISubGraphNode['subgraph'];

    constructor(config: SubGraphNodeConfig) {
        super({ ...config, type: 'subgraph' });
        this.subgraph = config.subgraph;
    }

    async onExecute(ctx: EngineContext): Promise<any> {
        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_BEFORE);

        try {
            // 1. 获取子工作流定义
            const subWorkflow = await this.getSubWorkflow(ctx);
            if (!subWorkflow) {
                throw new Error(`SubWorkflow ${this.subgraph.workflowId} not found`);
            }

            // 2. 解析输入参数映射
            const subWorkflowInput = this.resolveInputMapping(ctx);

            // 3. 创建子工作流的独立引擎实例 - 利用你预留的 clone() 方法！
            const subEngine = ctx.engine.clone();

            // 4. 处理状态继承
            if (this.subgraph.inheritState) {
                // 如果选择继承状态，复制父工作流的状态
                const parentState = ctx.state.getAll();
                Object.entries(parentState).forEach(([key, value]) => {
                    subEngine.state.setState(key, value);
                });
            }

            // 5. 运行子工作流
            const subWorkflowResult = await subEngine.run(subWorkflowInput);

            // 6. 处理输出结果映射
            const mappedResult = this.resolveOutputMapping(subWorkflowResult);

            // 7. 将子工作流结果存储到当前节点状态
            ctx.state.setState(this.id, {
                workflowId: this.subgraph.workflowId,
                input: subWorkflowInput,
                output: subWorkflowResult,
                mappedOutput: mappedResult,
                executedAt: new Date().toISOString()
            });

            ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_AFTER);

            // 8. 继续执行下一个节点
            if (this.subgraph.next) {
                return await ctx.engine.runNode(this.subgraph.next);
            }

            return mappedResult;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // 错误处理
            if (this.subgraph.onError === 'continue') {
                console.error(`SubGraphNode ${this.id} error (continuing):`, errorMessage);
                ctx.state.setState(this.id, {
                    workflowId: this.subgraph.workflowId,
                    error: errorMessage,
                    failedAt: new Date().toISOString()
                });

                ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_AFTER);

                if (this.subgraph.next) {
                    return await ctx.engine.runNode(this.subgraph.next);
                }
            } else {
                // 默认行为：停止执行
                console.error(`SubGraphNode ${this.id} error (stopping):`, errorMessage);
                throw new Error(`SubWorkflow execution failed: ${errorMessage}`);
            }
        }
    }

    /**
     * 获取子工作流定义
     * 这里需要与你的工作流注册表或存储机制集成
     */
    private async getSubWorkflow(ctx: EngineContext): Promise<any> {
        // 方案1: 从工作流注册表获取
        if ((ctx.engine as any).workflowRegistry) {
            return (ctx.engine as any).workflowRegistry.getWorkflow(this.subgraph.workflowId);
        }

        // 方案2: 从数据库或文件系统获取
        // 这里可以根据你的实际存储机制来实现

        // 方案3: 从元数据中获取（如果是嵌入式定义）
        if (this.metadata?.subWorkflowDefinition) {
            return this.metadata.subWorkflowDefinition;
        }

        throw new Error(`Unable to find sub-workflow: ${this.subgraph.workflowId}`);
    }

    /**
     * 解析输入参数映射
     */
    private resolveInputMapping(ctx: EngineContext): Record<string, any> {
        if (!this.subgraph.inputMapping) {
            return {};
        }

        const result: Record<string, any> = {};

        for (const [key, input] of Object.entries(this.subgraph.inputMapping)) {
            if (input.type === 'literal') {
                result[key] = input.value;
            } else if (input.type === 'ref') {
                const [nodeId, ...restPath] = input.path.split('.');
                const nodeOutput = ctx.state.getState(nodeId);

                if (nodeOutput) {
                    const valuePath = restPath.join('.');
                    const get = require('lodash/get');
                    result[key] = valuePath ? get(nodeOutput, valuePath) : nodeOutput;
                } else {
                    result[key] = null;
                }
            } else if (input.type === 'template') {
                // 处理模板字符串
                let templateResult = input.template;
                const variableRegex = /\$\{([^}]+)\}/g;
                let match;

                while ((match = variableRegex.exec(input.template)) !== null) {
                    const fullMatch = match[0];
                    const variablePath = match[1].trim();
                    const parts = variablePath.split('.');

                    if (parts.length > 0) {
                        const nodeId = parts[0];
                        const restPath = parts.slice(1).join('.');
                        const nodeOutput = ctx.state.getState(nodeId);

                        if (nodeOutput) {
                            const get = require('lodash/get');
                            const variableValue = restPath ? get(nodeOutput, restPath) : nodeOutput;
                            templateResult = templateResult.replace(fullMatch, String(variableValue));
                        }
                    }
                }

                result[key] = templateResult;
            }
        }

        return result;
    }

    /**
     * 解析输出结果映射
     */
    private resolveOutputMapping(subWorkflowResult: any): Record<string, any> {
        if (!this.subgraph.outputMapping) {
            // 如果没有输出映射，返回整个结果
            return subWorkflowResult || {};
        }

        const mappedResult: Record<string, any> = {};
        const get = require('lodash/get');

        for (const [outputKey, resultPath] of Object.entries(this.subgraph.outputMapping)) {
            mappedResult[outputKey] = get(subWorkflowResult, resultPath as string);
        }

        return mappedResult;
    }
}
