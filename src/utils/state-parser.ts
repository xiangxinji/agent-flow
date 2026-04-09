import { Input } from "@/interface/graph/input";
import get from 'lodash/get'
import { EngineStateManager } from "@/workflow-engine/state";

export class EngineStateGetter {
    static getInput<T>(state: EngineStateManager, input: Record<string, Input>): T {

        const result = {} as Record<string, any>;

        for (const key in input) {
            const item = input[key];

            if (item.type === 'running') {
                const data = state.getState('[running-input]');
                result[key] = get(data, item.path);
                continue;
            }

            /**
             * 引用其它节点上的 output 
             */
            if (item.type === 'ref') {
                const [id] = item.path.split('.');
                const data = state.getState('[node-output-' + id + ']');

                const temp = {
                    [id]: data
                }

                
                result[key] = get(temp, item.path);
                continue;
            }
        }

        return result as T;

    }
}