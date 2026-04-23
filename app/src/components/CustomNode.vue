<template>
  <div class="node">
    <div class="header" :style="{ backgroundColor: color }">
      <span class="icon">{{ icon }}</span>
      <span class="label">{{ label }}</span>
    </div>
    <div class="body">
      <div class="id">{{ data?.id }}</div>
    </div>
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { GraphNodeType, INode } from '@/types/workflow'

const props = defineProps<{ data?: INode }>()

const nodeConfig: Record<GraphNodeType, { icon: string; color: string; label: string }> = {
  agent: { icon: '🤖', color: '#42b883', label: '智能代理' },
  'tool': { icon: '🔧', color: '#f59e0b', label: '工具调用' },
  branch: { icon: '🔀', color: '#8b5cf6', label: '分支' },
  iterator: { icon: '🔄', color: '#ec4899', label: '迭代器' },
  parallel: { icon: '⚡', color: '#06b6d4', label: '并行' },
  'intent-recognition': { icon: '🎯', color: '#ef4444', label: '意图识别' }
}

const type = computed(() => props.data?.type || 'agent')
const icon = computed(() => nodeConfig[type.value]?.icon || '📦')
const color = computed(() => nodeConfig[type.value]?.color || '#6c757d')
const label = computed(() => nodeConfig[type.value]?.label || 'Node')
</script>

<style scoped>
.node {
  background: #1f1f1f;
  border: 1px solid #333;
  border-radius: 6px;
  min-width: 120px;
}

.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 5px 5px 0 0;
  color: white;
}

.icon {
  font-size: 1rem;
}

.label {
  font-size: 0.8rem;
  font-weight: 600;
}

.body {
  padding: 0.5rem 0.75rem;
}

.id {
  font-family: monospace;
  font-size: 0.7rem;
  color: #666;
}
</style>
