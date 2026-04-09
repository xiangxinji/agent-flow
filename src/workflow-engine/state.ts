import { Input } from '@/interface/graph/input';
import cloneDeep from 'lodash/cloneDeep'
type State = {
    key: string
    data: any
}
export class EngineStateManager {

    private state: State[] = [];

    setState(key: string, data: any) {
        const lastIndex = this.state.findIndex(i => i.key === key);
        if (lastIndex > -1) {
            this.state.splice(lastIndex, 1);
        }

        this.state.push({
            key,
            data: cloneDeep(data)
        })
    }


    getState(key: string) {
        const ind = this.state.findIndex(i => i.key === key);
        if (ind === -1) return null
        return cloneDeep(this.state[ind].data);
    }
}