<template>
  <div class="config">
    <div class="field">
      <label>Array</label>
      <input type="text" v-model="localConfig.array" @input="updateConfig" placeholder="Array source..." />
    </div>
    <div class="field">
      <label>Target</label>
      <input type="text" v-model="localConfig.target" @input="updateConfig" placeholder="Target node..." />
    </div>
    <div class="field">
      <label>Item Key</label>
      <input type="text" v-model="localConfig.itemKey" @input="updateConfig" placeholder="item" />
    </div>
    <div class="field">
      <label>Index Key</label>
      <input type="text" v-model="localConfig.indexKey" @input="updateConfig" placeholder="index" />
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
import type { IIteratorNode } from '@/types/workflow'

const props = defineProps<{ node: IIteratorNode }>()
const workflowStore = useWorkflowStore()

const localConfig = reactive({
  array: props.node.iterator?.array || '',
  target: props.node.iterator?.target || '',
  itemKey: props.node.iterator?.itemKey || 'item',
  indexKey: props.node.iterator?.indexKey || 'index',
  next: props.node.iterator?.next || ''
})

const updateConfig = () => {
  workflowStore.updateNode(props.node.id, { iterator: { ...localConfig } })
}

watch(() => props.node, (n) => {
  if (n.iterator) {
    localConfig.array = n.iterator.array
    localConfig.target = n.iterator.target
    localConfig.itemKey = n.iterator.itemKey || 'item'
    localConfig.indexKey = n.iterator.indexKey || 'index'
    localConfig.next = n.iterator.next || ''
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
}
</style>
