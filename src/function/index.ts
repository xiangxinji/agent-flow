import  { ExecutorFunction } from "./base";


export class FunctionRegistry {
    private functionInstances = new Map<string, ExecutorFunction<any, any>>();

    constructor() {
    }

    register(functionInstance: ExecutorFunction<any, any>) {
        this.functionInstances.set(functionInstance.name, functionInstance);
    }

    getFunctionInstance(name: string): ExecutorFunction<any, any> | undefined {
        return this.functionInstances.get(name);
    }

    call(name: string, input: Record<string, any>) {
        const fun = this.getFunctionInstance(name);
        if (!fun) {
            throw new Error(`Function ${name} not found`);
        }
        return fun.execute(input);
    }

    getAllFunctions() {
        const functions: Array<{ name: string, code: string }> = [];
        for (const [name, instance] of this.functionInstances.entries()) {
            functions.push({
                name : instance.description,
                code: name
            });
        }
        return functions;
    }

}

