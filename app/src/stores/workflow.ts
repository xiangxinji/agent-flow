import { defineStore } from 'pinia'
import type { IFlow, INode, IEdge } from '@/types/workflow'

export const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    workflow: null as IFlow | null,
    selectedNode: null as INode | null,
    selectedEdge: null as IEdge | null
  }),

  getters: {
    nodes: (state) => state.workflow?.nodes || [],
    edges: (state) => state.workflow?.edges || [],
    root: (state) => state.workflow?.root || ''
  },

  actions: {
    initWorkflow() {
      if (!this.workflow) {
        this.workflow = {
          id: `workflow-${Date.now()}`,
          name: 'New Workflow',
          version: '1.0.0',
          nodes: [],
          edges: [],
          root: ''
        }
      }
    },

    setWorkflow(workflow: IFlow) {
      this.workflow = workflow
    },

    selectNode(node: INode | null) {
      this.selectedNode = node
      this.selectedEdge = null
    },

    selectEdge(edge: IEdge | null) {
      this.selectedEdge = edge
      this.selectedNode = null
    },

    addNode(node: INode) {
      if (this.workflow) {
        this.workflow.nodes.push(node)
      }
    },

    removeNode(nodeId: string) {
      if (this.workflow) {
        this.workflow.nodes = this.workflow.nodes.filter(n => n.id !== nodeId)
        this.workflow.edges = this.workflow.edges.filter(
          e => e.from !== nodeId && e.to !== nodeId
        )
      }
    },

    addEdge(edge: IEdge) {
      if (this.workflow) {
        this.workflow.edges.push(edge)
      }
    },

    removeEdge(edge: IEdge) {
      if (this.workflow) {
        this.workflow.edges = this.workflow.edges.filter(
          e => e.from !== edge.from || e.to !== edge.to
        )
      }
    },

    updateNode(nodeId: string, updates: Partial<INode>) {
      if (this.workflow) {
        const index = this.workflow.nodes.findIndex(n => n.id === nodeId)
        if (index !== -1) {
          this.workflow.nodes[index] = { ...this.workflow.nodes[index], ...updates }
        }
      }
    }
  }
})
