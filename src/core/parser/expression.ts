import { get } from 'lodash'; // 推荐使用 lodash.get 处理深层路径，或者手写一个简单的 get

/**
 * 表达式解析器
 * 用于解析和执行 DSL 表达式
 * 支持的操作符: ==, !=, >, <, >=, <=, contains
 * 支持的变量路径: steps.nodeId.output.data
 */
export class ExpressionParser {
    // 定义支持的操作符及其优先级/逻辑
    private operators: Record<string, (a: any, b: any) => boolean> = {
        '==': (a, b) => a == b,
        '!=': (a, b) => a != b,
        '>': (a, b) => Number(a) > Number(b),
        '<': (a, b) => Number(a) < Number(b),
        '>=': (a, b) => Number(a) >= Number(b),
        '<=': (a, b) => Number(a) <= Number(b),
        'contains': (a, b) => Array.isArray(a) && a.includes(b),
    };

    /**
     * 核心执行方法
     * @param expression DSL 表达式，如 "steps.node_1.output.status == 'success'"
     * @param context Mastra 运行时上下文
     */
    public evaluate(expression: string, context: any): boolean {
        // 1. 快速处理静态布尔值
        if (expression === 'true') return true;
        if (expression === 'false') return false;

        // 2. 词法拆解 (支持基本的 变量 + 操作符 + 值)
        // 这里的正则支持：变量/路径 (steps.xx) + 操作符 + 字符串/数字
        const regex = /^\s*(?<left>[\w.]+)\s*(?<op>==|!=|>|<|>=|<=|contains)\s*(?<right>.+)\s*$/;
        const match = expression.match(regex);

        if (!match || !match.groups) {
            console.error(`[ExpressionParser] 无法解析表达式: ${expression}`);
            return false;
        }

        const { left, op, right } = match.groups;

        // 3. 提取左值 (从 Mastra Context 中拿数据)
        // Mastra 的 context 结构通常是 { steps: { [stepId]: { output: ... } } }
        const leftValue = this.resolveValue(left, context);

        // 4. 提取右值 (处理字符串引号或数字类型)
        const rightValue = this.parseLiteral(right.trim());

        // 5. 执行运算
        const handler = this.operators[op];
        if (!handler) return false;

        return handler(leftValue, rightValue);
    }

    /**
     * 从 Context 中解析变量路径
     */
    public resolveValue(path: string, context: any): any {
        // Mastra context 访问示例: steps.nodeId.output.data
        // 如果路径以 steps 开头，直接从 context 里捞
        return get(context, path);
    }

    /**
     * 解析右值的字面量 (String, Number, Boolean)
     */
    private parseLiteral(val: string): any {
        // 处理带引号的字符串
        if (/^['"].*['"]$/.test(val)) {
            return val.slice(1, -1);
        }
        // 处理数字
        if (!isNaN(Number(val))) {
            return Number(val);
        }
        // 处理布尔
        if (val === 'true') return true;
        if (val === 'false') return false;

        return val;
    }
}

export const expressionParser = new ExpressionParser();