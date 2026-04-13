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
}