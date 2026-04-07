
import { ExecutorNode } from "../node/executor";
import type { ExecutorType } from "../../../interface/flow/executor";

export type BaseExecutorConfig = {
    type : ExecutorType
}

export abstract class BaseExecutor {
    protected type: ExecutorType;

    constructor ({ type }: BaseExecutorConfig) {
        this.type = type;
    }

    abstract execute(node: ExecutorNode): Promise<void>;
}
