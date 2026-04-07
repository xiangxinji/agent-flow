
export class EngineState {

    state : Map<string, any> = new Map();


    set (key: string, value: any) {
        this.state.set(key, value);
    }
    
    get (key: string) {
        return this.state.get(key);
    }


    clear () {
        this.state.clear();
    }

    allSet (data : Record<string, any>) {
        for (const [key, value] of Object.entries(data)) {
            this.state.set(key, value);
        }
    }

    /**
     * 进行继承 ， 如果像 subgraph 这种需要继承父图的 state 
     * @param parent 
     */
    extend (parent : EngineState) {
        for (const [key, value] of parent.state) {
            this.state.set(key, value);
        }
    }



    
}