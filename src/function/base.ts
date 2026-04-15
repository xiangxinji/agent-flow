


export type CommonInput = { input: string }

export abstract class ExecutorFunction<Input,Output> {

    
    constructor(public name: string) {
        this.name = name;
    }
    
    abstract execute(input: Input) : Output;


}