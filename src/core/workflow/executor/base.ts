
import { ExecutorNode } from "../node/executor";
import { ExecutorRuntime } from "../runtime";


export type ExecutorType = 'agent' | 'function-call' | 'intent-recognition';


export type BaseExecutorConfig = {
    type: ExecutorType
}



export abstract class BaseExecutor {
    protected type: ExecutorType;

    constructor({ type }: BaseExecutorConfig) {
        this.type = type;
    }

    abstract execute(node: ExecutorNode, runtime: ExecutorRuntime): Promise<Record<string, any>>;
}
