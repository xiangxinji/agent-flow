import type { EngineContext } from "../engine";

export class ExecutorRuntime {
    public engineContext: EngineContext;

    constructor({ engineContext }: { engineContext: EngineContext }) {
        this.engineContext = engineContext;
    }

}
