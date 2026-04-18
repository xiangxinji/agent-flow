<template>
  <div class="config">
    <div class="field">
      <label>分支列表</label>
      <div v-for="(branch, index) in localConfig.branches" :key="index" class="branch">
        <input type="text" v-model="localConfig.branches[index]" @input="updateConfig" placeholder="分支节点..." />
        <button @click="removeBranch(index)" class="remove">×</button>
      </div>
      <button @click="addBranch" class="add">+ 添加分支</button>
    </div>
    <div class="field">
      <label>下一步（可选）</label>
      <input type="text" v-model="localConfig.next" @input="updateConfig" placeholder="下一步节点..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useWorkflowStore } from '@/stores/workflow'
import type { IParallelNode } from '@/types/workflow'

const props = defineProps<{ node: IParallelNode }>()
const workflowStore = useWorkflowStore()

const localConfig = reactive({
  branches: props.node.parallel?.branches || [],
  next: props.node.parallel?.next || ''
})

const addBranch = () => {
  localConfig.branches.push('')
  updateConfig()
}

const removeBranch = (index: number) => {
  localConfig.branches.splice(index, 1)
  updateConfig()
}

const updateConfig = () => {
  workflowStore.updateNode(props.node.id, { parallel: { ...localConfig } })
}

watch(() => props.node, (n) => {
  if (n.parallel) {
    localConfig.branches = n.parallel.branches
    localConfig.next = n.parallel.next || ''
  }
}, { deep: true })
</script>

<style scoped>
.config { margin-top: 0.5rem; }
.field { margin-bottom: 0.875rem; }
.field label {
  display: block;
  margin-bottom: 0.375rem;
  color: #888;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.branch { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
.branch input { flex: 1; margin-bottom: 0; }
.remove {
  background: #333;
  color: #888;
  border: none;
  border-radius: 4px;
  padding: 0 0.75rem;
  cursor: pointer;
}
.remove:hover { background: #444; color: #fff; }
.add {
  width: 100%;
  padding: 0.5rem;
  background: #222;
  color: #888;
  border: 1px dashed #444;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}
.add:hover { border-color: #555; color: #fff; }
</style>
