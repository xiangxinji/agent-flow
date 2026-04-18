<template>
  <div class="palette">
    <div class="nodes">
      <div
        v-for="nodeType in nodeTypes"
        :key="nodeType.type"
        class="node"
        draggable="true"
        @dragstart="onDragStart($event, nodeType.type)"
      >
        <span class="icon">{{ nodeType.icon }}</span>
        <span class="label">{{ nodeType.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { GraphNodeType } from '@/types/workflow'

const nodeTypes = ref([
  { type: 'agent' as GraphNodeType, label: '智能代理', icon: '🤖' },
  { type: 'function-call' as GraphNodeType, label: '函数调用', icon: '⚡' },
  { type: 'branch' as GraphNodeType, label: '分支', icon: '🔀' },
  { type: 'iterator' as GraphNodeType, label: '迭代器', icon: '🔄' },
  { type: 'parallel' as GraphNodeType, label: '并行', icon: '⚡' },
  { type: 'intent-recognition' as GraphNodeType, label: '意图识别', icon: '🎯' }
])

const onDragStart = (event: DragEvent, nodeType: GraphNodeType) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }
}
</script>

<style scoped>
.palette {
  width: 180px;
  background: #141414;
  border-right: 1px solid #333;
  padding: 1rem 0.75rem;
}

.nodes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.node {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s;
}

.node:hover {
  background: #2a2a2a;
  border-color: #444;
}

.node:active {
  cursor: grabbing;
}

.icon {
  font-size: 1.25rem;
}

.label {
  color: #e0e0e0;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
