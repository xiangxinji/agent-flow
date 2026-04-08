import { ExecutorFunction } from "../base";


export class ToJsonConvertFunction extends ExecutorFunction<string,any> {
    constructor() {
        super('convert.to-json');
    }
    
    execute(input: string) : any {
        console.log('input' , input );
        return JSON.parse(input);
    }
}