export type NodeType = 'execution' | ''

import { AgentExecutor, FunctionExecutor } from './executor';
import { InputSource } from './input';
import { ExecutionPolicy } from './policy';


// 基础节点属性 (所有节点共有)
interface BaseNode {
    id: string;
    metadata?: {
        x: number; y: number; // UI 坐标
        label: string;
    };
}

export interface ExecutionNode extends BaseNode {
    /**
     * 节点类型
     */
    type: NodeType;
    // 1. 输入映射：定义如何从全局 Context 或上游节点提取数据
    // 支持 JSONPath 或 简单的 Key-Value 映射
    input: {
        [key: string]: InputSource;
    };

    // 2. 执行配置：根据 type 动态变化
    executor: AgentExecutor | FunctionExecutor;

    // 3. 运行策略：控制重试、超时等
    policy?: ExecutionPolicy;

    // 4. 输出定义：定义如何处理执行结果
    output?: {
        schema?: any; // 可选的 JSON Schema 校验
        exportAs?: string; // 导出到 Context 的变量名
    };

    // --- 控制流 (Control Flow) ---
    /**
     * 静态连接：下一步去哪（简单 DAG）
     */
    next?: string


    // --- 生命周期钩子 ---
    hooks?: {
        onBefore?: string; // 执行前的预处理脚本或函数名
        onAfter?: string;  // 执行后的后处理
    };

    catch?: string; // 异常处理节点 ID
}


export interface BranchNode extends BaseNode {
    type: 'branch';
    source: string; // 数据源路径，如 "$.steps.prev.output"
    cases: Array<{
        expression: string; // 判断条件，如 "== 'success'"
        target: string;     // 目标节点 ID
    }>;
    default: string;     // 兜底出口
}


// 3. 循环节点（你提议加的这个，完美！）
export interface IteratorNode extends BaseNode {
    type: 'iterator';
    items: string;         // 循环的数组源
    loopNodeId: string;    // 循环体指向的节点
    next: string;          // 整个循环彻底结束后的下一步
}

// 子工作流
export interface SubGraphNode extends BaseNode {
    type: 'subgraph';

    // 内嵌一个完整的子工作流
    workflow: {
        nodes: WorkflowNode[];
        startNodeId: string;
    };

    next: string;
}


// ==========================================
// 4. 并行节点 (控制流驱动的显式分叉)
// ==========================================
export interface ParallelNode extends BaseNode {
    type: 'parallel';

    // 1. 并发分支：在这里显式声明你要同时跑哪几个节点
    // 依然没有破坏 ExecutionNode 的单出规则，只有 ParallelNode 拥有分叉能力
    branches: Array<{
        target: string; // 目标节点 ID (例如：'NodeB', 'NodeC')
    }>;

    // 2. AND 聚合：当 branches 里的所有链路彻底执行完后，下一步去哪
    next: string;
}

// 统一的节点类型
export type WorkflowNode = ExecutionNode | BranchNode | IteratorNode | SubGraphNode | ParallelNode;


export type HasNextNode = ExecutionNode | IteratorNode | SubGraphNode | ParallelNode;