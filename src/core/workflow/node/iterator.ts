import { EngineContext } from "../engine";
import { BaseNode, NodeConfig } from "./base";
import { IIteratorNode } from "@/core/interface/graph/graph";
import { ENGINE_STAGE } from "@/core/enums/engine";

export type IteratorNodeConfig = Omit<NodeConfig & {
    iterator: IIteratorNode['iterator'];
}, 'type'>;

export class IteratorNode extends BaseNode {
    public iterator: IIteratorNode['iterator'];

    constructor(config: IteratorNodeConfig) {
        super({ ...config, type: 'iterator' });
        this.iterator = config.iterator;
    }

    async onExecute(ctx: EngineContext): Promise<any> {
        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_BEFORE);

        // 1. 解析要迭代的数组
        const array = this.resolveIteratorArray(ctx);

        if (!Array.isArray(array)) {
            throw new Error(`Iterator node ${this.id}: array source must resolve to an array, got ${typeof array}`);
        }

        // 2. 准备迭代参数
        const itemKey = this.iterator.itemKey || 'item';
        const indexKey = this.iterator.indexKey || 'index';
        const targetNode = this.iterator.target;
        const parallel = this.iterator.parallel || false;

        // 3. 执行迭代
        const results = [];

        if (parallel) {
            // 并行模式：使用 Promise.all 并发处理
            const promises = array.map(async (item, index) => {
                // 为每个迭代创建独立的状态副本
                const iterationState = this.createIterationState(ctx, item, index, itemKey, indexKey);
                return await this.executeIteration(ctx, targetNode, iterationState, index);
            });

            const parallelResults = await Promise.all(promises);
            results.push(...parallelResults);
        } else {
            // 顺序模式：逐个处理
            for (let i = 0; i < array.length; i++) {
                const item = array[i];

                // 设置当前迭代的元素和索引到状态
                ctx.state.setItem(itemKey, item);
                ctx.state.setIndex(indexKey, i);

                // 将当前迭代项存储在节点输出中，以便其他节点可以通过 ref 引用
                ctx.state.setState(this.id, {
                    [itemKey]: item,
                    [indexKey]: i,
                    total: array.length,
                    currentIndex: i
                });

                // 执行子节点
                try {
                    const result = await ctx.engine.runNode(targetNode);
                    results.push({
                        index: i,
                        success: true,
                        result: result
                    });
                } catch (error) {
                    results.push({
                        index: i,
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    });
                    // 可以选择在这里抛出错误中断迭代，或者继续处理下一个元素
                    // throw error; // 取消注释以在第一个错误时中断
                }
            }
        }

        // 4. 存储迭代结果到状态
        ctx.state.setState(this.id, {
            total: array.length,
            successful: results.filter((r: any) => r.success).length,
            failed: results.filter((r: any) => !r.success).length,
            results: results
        });

        ctx.engine.emit(ENGINE_STAGE.NODE_EXECUTE_AFTER);

        // 5. 继续执行下一个节点
        if (this.iterator.next) {
            return await ctx.engine.runNode(this.iterator.next);
        }
    }

    /**
     * 解析要迭代的数组
     */
    private resolveIteratorArray(ctx: EngineContext): any[] {
        const arrayInput = this.iterator.array;

        if (arrayInput.type === 'literal') {
            return arrayInput.value;
        } else if (arrayInput.type === 'ref') {
            const [nodeId, ...restPath] = arrayInput.path.split('.');
            const nodeOutput = ctx.state.getState(nodeId);

            if (nodeOutput) {
                const valuePath = restPath.join('.');
                // 使用 lodash get 来获取嵌套属性
                const get = require('lodash/get');
                return valuePath ? get(nodeOutput, valuePath) : nodeOutput;
            }
            return [];
        } else if (arrayInput.type === 'template') {
            // 模板类型暂时不支持，因为需要返回数组
            throw new Error('Template type is not supported for iterator array source');
        }

        return [];
    }

    /**
     * 创建迭代状态（用于并行模式）
     */
    private createIterationState(ctx: EngineContext, item: any, index: number, itemKey: string, indexKey: string) {
        return {
            item,
            index,
            itemKey,
            indexKey
        };
    }

    /**
     * 执行单次迭代（用于并行模式）
     */
    private async executeIteration(ctx: EngineContext, targetNode: string, iterationState: any, index: number) {
        try {
            // 在并行模式下，我们需要克隆引擎实例以避免状态冲突
            const clonedEngine = ctx.engine.clone();

            // 设置当前迭代的元素和索引
            clonedEngine.state.setItem(iterationState.itemKey, iterationState.item);
            clonedEngine.state.setIndex(iterationState.indexKey, iterationState.index);

            // 执行子节点
            const result = await clonedEngine.runNode(targetNode);

            return {
                index: index,
                success: true,
                result: result
            };
        } catch (error) {
            return {
                index: index,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
}
