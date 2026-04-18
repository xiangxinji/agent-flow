<template>
  <div class="config">
    <div class="field">
      <label>Function</label>
      <input type="text" v-model="localConfig.fnName" @input="updateConfig" placeholder="Function name..." />
    </div>
    <div class="field">
      <label>Input</label>
      <textarea v-model="inputJson" @input="updateInputConfig" placeholder='{"key": "value"}' />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWorkflowStore } from '@/stores/workflow'
import type { IFunctionCallNode } from '@/types/workflow'

const props = defineProps<{ node: IFunctionCallNode }>()
const workflowStore = useWorkflowStore()

const localConfig = ref({
  fnName: props.node.function?.fnName || '',
  input: props.node.function?.input || {}
})

const inputJson = ref(JSON.stringify(localConfig.value.input, null, 2))

const updateConfig = () => {
  workflowStore.updateNode(props.node.id, { function: { ...localConfig.value } })
}

const updateInputConfig = () => {
  try {
    localConfig.value.input = JSON.parse(inputJson.value)
    updateConfig()
  } catch {}
}

watch(() => props.node, (n) => {
  if (n.function) {
    localConfig.value.fnName = n.function.fnName
    localConfig.value.input = n.function.input
    inputJson.value = JSON.stringify(n.function.input, null, 2)
  }
}, { deep: true })
</script>

<style scoped>
.config {
  margin-top: 0.5rem;
}

.field {
  margin-bottom: 0.875rem;
}

.field label {
  display: block;
  margin-bottom: 0.375rem;
  color: #888;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field input,
.field textarea {
  width: 100%;
  padding: 0.5rem;
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 0.875rem;
}

.field textarea {
  min-height: 60px;
  resize: vertical;
}
</style>
