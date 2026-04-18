<template>
  <div class="config">
    <div class="field">
      <label>指令</label>
      <textarea v-model="localConfig.instructions" @input="updateConfig" placeholder="代理指令..." />
    </div>
    <div class="field">
      <label>模型</label>
      <select v-model="localConfig.model" @change="updateConfig">
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        <option value="gpt-4">GPT-4</option>
        <option value="gpt-4-turbo">GPT-4 Turbo</option>
      </select>
    </div>
    <div class="field">
      <label>提示词</label>
      <input type="text" v-model="localConfig.input.prompt" @input="updateConfig" placeholder="提示词输入..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useWorkflowStore } from '@/stores/workflow'
import type { IAgentNode } from '@/types/workflow'

const props = defineProps<{ node: IAgentNode }>()
const workflowStore = useWorkflowStore()

const localConfig = reactive({
  instructions: props.node.agent?.instructions || '',
  model: props.node.agent?.model || 'gpt-3.5-turbo',
  input: { prompt: props.node.agent?.input?.prompt || '' }
})

const updateConfig = () => {
  workflowStore.updateNode(props.node.id, { agent: { ...localConfig } })
}

watch(() => props.node, (n) => {
  if (n.agent) {
    localConfig.instructions = n.agent.instructions
    localConfig.model = n.agent.model
    localConfig.input.prompt = n.agent.input.prompt
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
.field textarea,
.field select {
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
