
import { ExecutorNode } from "../node/executor";
import type { ExecutorType } from "../../../interface/flow/executor";
import { Input } from "../engine";

export type BaseExecutorConfig = {
    type : ExecutorType
}

export abstract class BaseExecutor {
    protected type: ExecutorType;

    constructor ({ type }: BaseExecutorConfig) {
        this.type = type;
    }

    abstract execute(node: ExecutorNode , input: Input): Promise<Record<string, any>>;
}
