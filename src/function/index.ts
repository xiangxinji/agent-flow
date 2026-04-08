import { ExecutorFunction } from "./base";
import { ToJsonConvertFunction } from "./convert/to-json";


export class FunctionRegistry {
    private functionInstances = new Map<string, ExecutorFunction<any, any>>();

    constructor() {
        this.register(new ToJsonConvertFunction());
    }

    register(functionInstance: ExecutorFunction<any, any>) {
        this.functionInstances.set(functionInstance.name, functionInstance);
    }

    getFunctionInstance(name: string): ExecutorFunction<any, any> | undefined {
        return this.functionInstances.get(name);
    }

    call(name: string, input: any) {
        const fun = this.getFunctionInstance(name);
        if (!fun) {
            throw new Error(`Function ${name} not found`);
        }
        return fun.execute(input);
    }

}



export const functionRegistry = new FunctionRegistry();
