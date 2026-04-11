import { Input } from "@/interface/graph/input";
import get from 'lodash/get'
import { EngineStateManager } from "@/workflow-engine/state";

export class EngineStateGetter {
    static getInput<T>(state: EngineStateManager, input: Record<string, Input>): T {
        const result = {} as Record<string, any>;

        for (const key in input) {
            const item = input[key];

            if (item.type === 'root') {
                const rootData = state.getState('root');
                result[key] = get(rootData, item.path);
                continue;
            }

            /**
             * 引用其它节点上的 output 
             */
            if (item.type === 'ref') {
                const [nodeId, ...restPath] = item.path.split('.');
                const nodeOutput = state.getState(nodeId);
                
                if (nodeOutput) {
                    // 直接从节点输出中获取值，不需要临时对象
                    const valuePath = restPath.join('.');
                    result[key] = valuePath ? get(nodeOutput, valuePath) : nodeOutput;
                } else {
                    result[key] = null;
                }
                continue;
            }

            /**
             * 固定值的输入参数
             */
            if (item.type === 'literal') {
                result[key] = item.value;
                continue;
            }
        }

        return result as T;
    }
}