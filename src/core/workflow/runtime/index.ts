import type { EngineContext } from "../../../workflow-engine";

export class ExecutorRuntime {
    public engineContext: EngineContext;

    constructor({ engineContext }: { engineContext: EngineContext }) {
        this.engineContext = engineContext;
    }

}
