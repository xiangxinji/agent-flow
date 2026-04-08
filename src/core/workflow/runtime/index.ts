import type { Input, EngineContext } from "../../../workflow-engine";

export class ExecutorRuntime {
    public input: Input;
    public engineContext: EngineContext;

    constructor({ input, engineContext }: { input: Input, engineContext: EngineContext }) {
        this.input = input;
        this.engineContext = engineContext;
    }

}
