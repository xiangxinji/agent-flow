
import { ExecutorNode } from "../node/executor";
import type { ExecutorType } from "../../../interface/flow/executor";
import type { EngineContext, Input } from "../../../workflow-engine";
import { ExecutorRuntime } from "../runtime";

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
