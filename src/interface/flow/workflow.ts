import { WorkflowNode } from "./node";

export interface Workflow {
    // ==========================================
    // 1. 元数据 (Metadata)
    // ==========================================
    id: string;              // 流程唯一标识
    name: string;            // 流程名称
    version: string;         // DSL 版本，如 "1.0.0"

    /**
     * 【你提议的 Root】工作流的起始节点 ID
     * 引擎解析完 trigger 拿到初始数据后，会立刻去 nodes 里找这个 ID 并执行
     */
    startNodeId : string;

    // ==========================================
    // 3. 静态全局资源池 (提升可维护性)
    // ==========================================
    /**
     * 全局静态变量或常量池
     * 比如大模型的 model 参数、飞书机器人的 Webhook URL 等
     */
    globals?: {
        [key: string]: any;
    };

    /**
     * 全局异常处理节点 ID
     */
    catchNodeId?: string;

    
    nodes: WorkflowNode[];
}