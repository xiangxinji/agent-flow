


export type CommonInput = { input: string }

export abstract class ExecutorFunction<Input,Output> {

    
    constructor(public name: string  , public description: string) {
        this.description = description;
        this.name = name;
    }
    
    abstract execute(input: Input) : Output;


}