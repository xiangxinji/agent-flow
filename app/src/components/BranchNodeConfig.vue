<template>
  <div class="config">
    <div class="field">
      <label>Cases</label>
      <div v-for="(caseItem, index) in localConfig.cases" :key="index" class="case">
        <input type="text" v-model="caseItem.condition" @input="updateConfig" placeholder="Condition..." />
        <input type="text" v-model="caseItem.target" @input="updateConfig" placeholder="Target..." />
        <button @click="removeCase(index)" class="remove">×</button>
      </div>
      <button @click="addCase" class="add">+ Add Case</button>
    </div>
    <div class="field">
      <label>Next (Optional)</label>
      <input type="text" v-model="localConfig.next" @input="updateConfig" placeholder="Next node..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useWorkflowStore } from '@/stores/workflow'
import type { IBranchNode } from '@/types/workflow'

const props = defineProps<{ node: IBranchNode }>()
const workflowStore = useWorkflowStore()

const localConfig = reactive({
  cases: props.node.branch?.cases || [],
  next: props.node.branch?.next || ''
})

const addCase = () => {
  localConfig.cases.push({ condition: '', target: '' })
  updateConfig()
}

const removeCase = (index: number) => {
  localConfig.cases.splice(index, 1)
  updateConfig()
}

const updateConfig = () => {
  workflowStore.updateNode(props.node.id, { branch: { ...localConfig } })
}

watch(() => props.node, (n) => {
  if (n.branch) {
    localConfig.cases = n.branch.cases
    localConfig.next = n.branch.next || ''
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
.field input {
  width: 100%;
  padding: 0.5rem;
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 0.875rem;
  margin-bottom: 0.375rem;
}
.case { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
.case input { flex: 1; margin-bottom: 0; }
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
