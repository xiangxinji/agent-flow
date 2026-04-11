export class ConditionParser {
    private context: Record<string, any> = {};

    constructor(context = {}) {
        this.context = context;
    }

    // 入口函数：解析形如 "{{ expr }}" 的字符串
    parse(conditionStr: string) {
        if (typeof conditionStr !== 'string') {
            throw new Error('Condition must be a string');
        }

        // 去除首尾空白
        conditionStr = conditionStr.trim();

        // 支持两种格式：带 {{}} 或不带（兼容性）
        let expr;
        if (conditionStr.startsWith('{{') && conditionStr.endsWith('}}')) {
            expr = conditionStr.slice(2, -2).trim();
        } else {
            expr = conditionStr;
        }

        return this.evaluate(expr);
    }

    // 安全地求值表达式（递归下降解析器简化版）
    evaluate(expr: string): boolean {
        try {
            // 移除多余空格，但保留字符串内的空格（本实现暂不支持字符串字面量）
            expr = expr.replace(/\s+/g, ' ');

            // 处理逻辑 OR: a || b
            if (expr.includes('||')) {
                const parts = expr.split('||').map(p => p.trim());
                return parts.some(part => this.evaluate(part));
            }

            // 处理逻辑 AND: a && b
            if (expr.includes('&&')) {
                const parts = expr.split('&&').map(p => p.trim());
                return parts.every(part => this.evaluate(part));
            }

            // 处理 NOT: !a
            if (expr.startsWith('!')) {
                return !this.getValue(expr.slice(1).trim());
            }

            // 处理比较操作符
            const compareOps = ['>=', '<=', '==', '!=', '>', '<'];
            for (const op of compareOps) {
                if (expr.includes(op)) {
                    const [left, right] = expr.split(op).map(s => s.trim());
                    const lval = this.getValue(left);
                    const rval = this.getValue(right);
                    switch (op) {
                        case '==': return lval == rval; // 非严格相等，便于字符串/数字比较
                        case '!=': return lval != rval;
                        case '>': return lval > rval;
                        case '<': return lval < rval;
                        case '>=': return lval >= rval;
                        case '<=': return lval <= rval;
                    }
                }
            }

            // 如果是单个值，直接返回其布尔值
            return Boolean(this.getValue(expr));

        } catch (e: any) {
            console.warn('Condition evaluation error:', e.message, 'in expr:', expr);
            return false; // 安全失败
        }
    }

    // 从上下文中安全获取值（支持嵌套路径如 "test-1.output.status"）
    getValue(path: string): any | undefined {
        if (/^['"].*['"]$/.test(path)) {
            // 字符串字面量（可选支持）
            return path.slice(1, -1);
        }

        if (/^-?\d+\.?\d*$/.test(path)) {
            // 数字字面量
            return parseFloat(path);
        }

        if (path === 'true') return true;
        if (path === 'false') return false;
        if (path === 'null') return null;
        if (path === 'undefined') return undefined;

        // 变量路径（如 test-1.status）
        let current = this.context;
        const keys = path.split('.');
        for (const key of keys) {
            if (current == null || typeof current !== 'object' || !(key in current)) {
                return undefined;
            }
            current = current[key];
        }
        return current;
    }
}