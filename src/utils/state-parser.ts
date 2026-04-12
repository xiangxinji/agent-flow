import { Input } from "@/interface/graph/input";
import get from 'lodash/get'
import { EngineStateManager } from "@/workflow-engine/state";

export class EngineStateGetter {
    static getInput<T>(state: EngineStateManager, input: Record<string, Input>): T {
        const result = {} as Record<string, any>;


        for (const key in input) {
            const item = input[key];

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

            /**
             * 模板类型的输入参数
             */
            if (item.type === 'template') {
                let templateResult = item.template;

                // 匹配模板中的所有变量：${nodeId.path}
                const variableRegex = /\$\{([^}]+)\}/g;
                let match;

                // 重置正则表达式的 lastIndex
                variableRegex.lastIndex = 0;

                while ((match = variableRegex.exec(item.template)) !== null) {
                    console.log('Match found:', match);

                    const fullMatch = match[0];
                    const variablePath = match[1].trim();
                    console.log('Variable path:', variablePath);

                    let variableValue: any = '';

                    // 解析变量路径：nodeId.path
                    const parts = variablePath.split('.');
                    if (parts.length > 0) {
                        const nodeId = parts[0];
                        const restPath = parts.slice(1).join('.');
                        console.log('Node ID:', nodeId);
                        console.log('Rest path:', restPath);

                        const nodeOutput = state.getState(nodeId);
                        console.log('Node output:', nodeOutput);

                        if (nodeOutput) {
                            variableValue = restPath ? get(nodeOutput, restPath) : nodeOutput;
                            console.log('Variable value:', variableValue);
                        }
                    }

                    // 替换模板中的变量
                    templateResult = templateResult.replace(fullMatch, String(variableValue));
                    console.log('Updated template:', templateResult);
                }

                result[key] = templateResult;
                console.log('Final result:', templateResult);
                continue;
            }


        }

        return result as T;
    }
}