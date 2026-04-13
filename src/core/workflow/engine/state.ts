import { Input } from '@/core/interface/graph/input';
import cloneDeep from 'lodash/cloneDeep'

export class EngineStateManager {

    private state = new Map<string, any>();

    setState(key: string, data: any) {
        this.state.set(key, cloneDeep(data));
    }

    getState(key: string) {
        if (!this.state.has(key)) return null;
        return cloneDeep(this.state.get(key));
    }

    clear() {
        this.state.clear();
    }

    has(key: string): boolean {
        return this.state.has(key);
    }

    delete(key: string): boolean {
        return this.state.delete(key);
    }

    getKeys(): string[] {
        return Array.from(this.state.keys());
    }

    getSize(): number {
        return this.state.size;
    }

    getAll(): Record<string, any> {
        return Object.fromEntries(this.state);
    }

    /**
     * 设置迭代项的值（用于 IteratorNode）
     */
    setItem(key: string, value: any) {
        this.state.set(`$${key}`, cloneDeep(value));
    }

    /**
     * 设置迭代索引的值（用于 IteratorNode）
     */
    setIndex(key: string, value: number) {
        this.state.set(`$${key}`, cloneDeep(value));
    }

    /**
     * 获取迭代项的值（用于 IteratorNode）
     */
    getItem(key: string): any {
        return this.getState(`$${key}`);
    }

    /**
     * 获取迭代索引的值（用于 IteratorNode）
     */
    getIndex(key: string): number {
        return this.getState(`$${key}`);
    }
}