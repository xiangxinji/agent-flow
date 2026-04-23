<template>
  <div class="canvas">
    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :node-types="nodeTypes"
      @node-click="onNodeClick"
      @edge-click="onEdgeClick"
      @connect="onConnect"
      :default-viewport="{ zoom: 1, x: 0, y: 0 }"
      :min-zoom="0.2"
      :max-zoom="4"
      fit-view-on-init
    >
      <Background />
      <Controls />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import CustomNode from './CustomNode.vue'
import { useWorkflowStore } from '@/stores/workflow'
import type { IEdge } from '@/types/workflow'

const workflowStore = useWorkflowStore()
const { addEdges } = useVueFlow()

const nodeTypes = {
  agent: markRaw(CustomNode),
  'tool': markRaw(CustomNode),
  branch: markRaw(CustomNode),
  iterator: markRaw(CustomNode),
  parallel: markRaw(CustomNode),
  'intent-recognition': markRaw(CustomNode)
}

const nodes = computed({
  get: () => {
    return workflowStore.nodes.map((node, index) => ({
      id: node.id,
      type: node.type,
      position: { x: 100 + (index % 3) * 200, y: 100 + Math.floor(index / 3) * 150 },
      data: node
    }))
  }
})

const edges = computed({
  get: () => {
    return workflowStore.edges.map(edge => ({
      id: `${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep'
    }))
  }
})

const onNodeClick = (event: any) => {
  workflowStore.selectNode(event.node.data)
}

const onEdgeClick = (event: any) => {
  const edge = event.edge
  const originalEdge = workflowStore.edges.find(
    e => `${e.from}-${e.to}` === edge.id
  )
  if (originalEdge) {
    workflowStore.selectEdge(originalEdge)
  }
}

const onConnect = (params: any) => {
  const newEdge: IEdge = {
    from: params.source,
    to: params.target
  }
  workflowStore.addEdge(newEdge)
  addEdges([params])
}
</script>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
}
</style>
