
import { EngineState } from "./state";
import { Workflow } from "../core/workflow";
import { BaseNode } from "../core/workflow/node/base";
import { WorkflowHistory } from "./history";
import { EventManager } from "@/utils/event-manager";
import { EngineEvent } from "@/enums/engine";




export type Input = Record<string, any>;

export type EngineContext = {
    engine: WorkflowEngine
    node: BaseNode
    state: EngineState
}

export class WorkflowEngine {

    public state: EngineState

    public history?: WorkflowHistory

    public event = new EventManager();

    constructor(public workflow: Workflow, { history } = { history: true }) {
        this.state = new EngineState();
        if (history) {
            this.history = new WorkflowHistory(this);
        }
    }

    /**
     * 运行指定节点
     * @param id 节点ID
     * @param input 输入数据
     * @returns 
     */
    public async runNode(id: string, input: Input = {}) {

        if (!id) {
            return;
        }
        const node = this.workflow.getNode(id);
        
        if (!node) {
            throw new Error(`Node ${id} not found`);
        }

        const context: EngineContext = {
            engine: this,
            node: node,
            state: this.state,
        };
        this.history?.put('execute-before', { nodeId: id, input });
        this.event.emit(EngineEvent.ExecuteBefore, context);
        const output = await node.onExecute(input, context);
        this.history?.put('execute-after', { nodeId: id, input, output });
        this.event.emit(EngineEvent.ExecuteAfter, context);
        return output;
    }

    /**
     * 运行当前工作流
     * @param input 
     * @returns 
     */
    public async run(input: Input = {}) {
        const root = this.workflow.getNode(this.workflow.root);
        if (!root) {
            throw new Error(`Root node ${this.workflow.root} not found`);
        }
        this.state.allSet(input);
        this.event.emit(EngineEvent.WORKFLOW_RUNNING);
        return await this.runNode(this.workflow.root, input);
    }


    /**
     * 克隆当前引擎实例，并继承其状态 
     * @returns 克隆的引擎实例
     */
    public clone() {
        const newEngine = new WorkflowEngine(this.workflow, { history: false });
        newEngine.state.extend(this.state);
        /**
         * 多个 engine 共享同一个 history 实例
         */
        newEngine.history = this.history;
        return newEngine;
    }


}
