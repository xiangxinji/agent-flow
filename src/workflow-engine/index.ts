
import { EngineState } from "./state";
import { Workflow } from "../core/workflow";
import { BaseNode } from "../core/workflow/node/base";
import { WorkflowHistory } from "./history";
import { EventManager } from "@/utils/event-manager";
import { ENGINE_STAGE } from "@/enums/engine";




export type Input = Record<string, any>;

export type EngineContext = {
    engine: WorkflowEngine
    node: BaseNode
    state: EngineState
}

export class WorkflowEngine {

    public state: EngineState

    public history?: WorkflowHistory

    public event !: EventManager;

    constructor(public workflow: Workflow, { history, event } = { history: true, event: true }) {
        this.state = new EngineState();
        if (history) {
            this.history = new WorkflowHistory(this);
        }
        if (event) {
            this.event = new EventManager();
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
        const output = await node.onExecute(input, context);
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
        this.emit(ENGINE_STAGE.WORKFLOW_RUNNING);
        const result = await this.runNode(this.workflow.root, input);
        this.emit(ENGINE_STAGE.WORKFLOW_COMPLETED);
        return result;
    }


    /**
     * 克隆当前引擎实例，并继承其状态 
     * @returns 克隆的引擎实例
     */
    public clone() {
        const newEngine = new WorkflowEngine(this.workflow, { history: false, event: false });
        newEngine.state.extend(this.state);
        /**
         * 多个 engine 共享同一个 history 和 event 实例
         */
        newEngine.history = this.history;
        newEngine.event = this.event;
        return newEngine;
    }

    /**
     * 发送事件 ， 并记入 history 
     * @param stage 事件阶段
     * @param args 事件参数
     */
    emit(stage: ENGINE_STAGE, ...args: any[]) {
        this.history?.put(stage, args);
        this.event?.emit(stage, ...args);
    }


}
