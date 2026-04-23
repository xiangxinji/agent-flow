<template>
  <div class="panel">
    <div class="header">
      <h3>配置</h3>
      <button @click="close" class="close">×</button>
    </div>
    <div class="content">
      <div class="field">
        <label>ID</label>
        <input type="text" :value="node.id" disabled />
      </div>
      <div class="field">
        <label>类型</label>
        <input type="text" :value="node.type" disabled />
      </div>
      <AgentNodeConfig v-if="node.type === 'agent'" :node="node" />
      <ToolNodeConfig v-else-if="node.type === 'tool'" :node="node" />
      <BranchNodeConfig v-else-if="node.type === 'branch'" :node="node" />
      <IteratorNodeConfig v-else-if="node.type === 'iterator'" :node="node" />
      <ParallelNodeConfig v-else-if="node.type === 'parallel'" :node="node" />
      <IntentRecognitionNodeConfig v-else-if="node.type === 'intent-recognition'" :node="node" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkflowStore } from '@/stores/workflow'
import AgentNodeConfig from './AgentNodeConfig.vue'
import ToolNodeConfig from './ToolNodeConfig.vue'
import BranchNodeConfig from './BranchNodeConfig.vue'
import IteratorNodeConfig from './IteratorNodeConfig.vue'
import ParallelNodeConfig from './ParallelNodeConfig.vue'
import IntentRecognitionNodeConfig from './IntentRecognitionNodeConfig.vue'
import type { INode } from '@/types/workflow'

const props = defineProps<{ node: INode }>()
const workflowStore = useWorkflowStore()

const close = () => {
  workflowStore.selectNode(null)
}
</script>

<style scoped>
.panel {
  width: 280px;
  background: #141414;
  border-left: 1px solid #333;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #333;
}

.header h3 {
  margin: 0;
  color: #e0e0e0;
  font-size: 0.875rem;
  font-weight: 600;
}

.close {
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close:hover {
  color: #fff;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  color: #888;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 0.625rem;
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 4px;
  color: #e0e0e0;
  font-size: 0.875rem;
}

.field input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.field textarea {
  min-height: 80px;
  resize: vertical;
}

.field select {
  cursor: pointer;
}
</style>
