<template>
  <div class="editor">
    <NodePalette />
    <div class="main">
      <div class="toolbar">
        <button @click="exportWorkflow" class="btn">导出</button>
        <button @click="importWorkflow" class="btn">导入</button>
        <input ref="fileInput" type="file" accept=".json" @change="onFileSelect" style="display: none" />
      </div>
      <div class="canvas" @drop="onDrop" @dragover.prevent>
        <WorkflowCanvas />
      </div>
    </div>
    <ConfigurationPanel v-if="selectedNode" :node="selectedNode" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import NodePalette from '@/components/NodePalette.vue'
import WorkflowCanvas from '@/components/WorkflowCanvas.vue'
import ConfigurationPanel from '@/components/ConfigurationPanel.vue'
import { useWorkflowStore } from '@/stores/workflow'
import type { INode, GraphNodeType } from '@/types/workflow'

const workflowStore = useWorkflowStore()

const fileInput = ref()

onMounted(() => {
  workflowStore.initWorkflow()
})

const selectedNode = computed(() => workflowStore.selectedNode)

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  const type = event.dataTransfer?.getData('application/vueflow') as GraphNodeType
  if (!type) return

  const newNode: INode = {
    id: `node-${Date.now()}`,
    type,
    ...(getDefaultNodeConfig(type))
  }
  workflowStore.addNode(newNode)
}

const getDefaultNodeConfig = (type: GraphNodeType): Partial<INode> => {
  const configs: Record<GraphNodeType, Partial<INode>> = {
    agent: { agent: { instructions: '', model: 'gpt-3.5-turbo', input: { prompt: '' } } },
    'function-call': { function: { fnName: '', input: {} } },
    branch: { branch: { cases: [] } },
    iterator: { iterator: { array: '', target: '' } },
    parallel: { parallel: { branches: [] } },
    'intent-recognition': { intentRecognition: { agent: { instructions: '', model: 'gpt-3.5-turbo' }, input: { data: '' }, intentions: [] } }
  }
  return configs[type] || {}
}

const exportWorkflow = () => {
  if (!workflowStore.workflow) return
  const dataStr = JSON.stringify(workflowStore.workflow, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${workflowStore.workflow.name || 'workflow'}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const importWorkflow = () => {
  fileInput.value?.click()
}

const onFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const workflow = JSON.parse(e.target?.result as string)
      workflowStore.setWorkflow(workflow)
    } catch {
      alert('无效的工作流文件')
    }
  }
  reader.readAsText(file)
}
</script>

<style scoped>
.editor {
  display: flex;
  height: 100vh;
  background: #1a1a1a;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #141414;
  border-bottom: 1px solid #333;
}

.btn {
  padding: 0.5rem 1rem;
  background: #222;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn:hover {
  background: #333;
  border-color: #555;
}

.canvas {
  flex: 1;
  background: #1a1a1a;
}
</style>
