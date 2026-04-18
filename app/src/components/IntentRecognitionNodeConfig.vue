<template>
  <div class="config">
    <div class="field">
      <label>指令</label>
      <textarea v-model="localConfig.agent.instructions" @input="updateConfig" placeholder="代理指令..." />
    </div>
    <div class="field">
      <label>模型</label>
      <select v-model="localConfig.agent.model" @change="updateConfig">
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        <option value="gpt-4">GPT-4</option>
        <option value="gpt-4-turbo">GPT-4 Turbo</option>
      </select>
    </div>
    <div class="field">
      <label>输入数据</label>
      <input type="text" v-model="localConfig.input.data" @input="updateConfig" placeholder="输入数据..." />
    </div>
    <div class="field">
      <label>意图列表</label>
      <div v-for="(intention, index) in localConfig.intentions" :key="index" class="intention">
        <input type="text" v-model="intention.name" @input="updateConfig" placeholder="意图名称..." />
        <input type="text" v-model="intention.target" @input="updateConfig" placeholder="目标节点..." />
        <button @click="removeIntention(index)" class="remove">×</button>
      </div>
      <button @click="addIntention" class="add">+ 添加意图</button>
    </div>
    <div class="field">
      <label>默认目标（可选）</label>
      <input type="text" v-model="localConfig.defaultTarget" @input="updateConfig" placeholder="默认目标节点..." />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useWorkflowStore } from '@/stores/workflow'
import type { IIntentRecognitionNode } from '@/types/workflow'

const props = defineProps<{ node: IIntentRecognitionNode }>()
const workflowStore = useWorkflowStore()

const localConfig = reactive({
  agent: {
    instructions: props.node.intentRecognition?.agent?.instructions || '',
    model: props.node.intentRecognition?.agent?.model || 'gpt-3.5-turbo'
  },
  input: { data: props.node.intentRecognition?.input?.data || '' },
  intentions: props.node.intentRecognition?.intentions || [],
  defaultTarget: props.node.intentRecognition?.defaultTarget || ''
})

const addIntention = () => {
  localConfig.intentions.push({ name: '', target: '' })
  updateConfig()
}

const removeIntention = (index: number) => {
  localConfig.intentions.splice(index, 1)
  updateConfig()
}

const updateConfig = () => {
  workflowStore.updateNode(props.node.id, { intentRecognition: { ...localConfig } })
}

watch(() => props.node, (n) => {
  if (n.intentRecognition) {
    localConfig.agent.instructions = n.intentRecognition.agent.instructions
    localConfig.agent.model = n.intentRecognition.agent.model
    localConfig.input.data = n.intentRecognition.input.data
    localConfig.intentions = n.intentRecognition.intentions
    localConfig.defaultTarget = n.intentRecognition.defaultTarget || ''
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
  margin-bottom: 0.375rem;
}
.field textarea { min-height: 60px; resize: vertical; }
.intention { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
.intention input { flex: 1; margin-bottom: 0; }
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
