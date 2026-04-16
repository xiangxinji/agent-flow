<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!container.value) return
  
  createWorkflowNodes()
})

function createWorkflowNodes() {
  if (!container.value) return
  
  const nodes = [
    { type: 'agent', x: 10, y: 20, delay: 0 },
    { type: 'function', x: 25, y: 35, delay: 0.5 },
    { type: 'branch', x: 40, y: 15, delay: 1 },
    { type: 'parallel', x: 55, y: 40, delay: 1.5 },
    { type: 'iterator', x: 70, y: 25, delay: 2 },
    { type: 'agent', x: 85, y: 45, delay: 2.5 },
  ]
  
  nodes.forEach((node, index) => {
    const el = document.createElement('div')
    el.className = `workflow-node-decoration ${node.type}`
    el.style.cssText = `
      position: absolute;
      left: ${node.x}%;
      top: ${node.y}%;
      animation: float ${3 + Math.random() * 2}s ease-in-out infinite;
      animation-delay: ${node.delay}s;
      opacity: 0;
      animation: fadeInFloat 1s ease-out ${node.delay}s forwards;
    `
    
    const icon = getNodeIcon(node.type)
    el.innerHTML = icon
    
    container.value?.appendChild(el)
  })
}

function getNodeIcon(type: string): string {
  const icons: Record<string, string> = {
    agent: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    function: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M8 12h8M12 8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    branch: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6h12M6 12h12M6 18h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="6" cy="6" r="2" fill="currentColor"/>
      <circle cx="18" cy="12" r="2" fill="currentColor"/>
      <circle cx="6" cy="18" r="2" fill="currentColor"/>
    </svg>`,
    parallel: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4v16M16 4v16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="8" cy="4" r="2" fill="currentColor"/>
      <circle cx="16" cy="4" r="2" fill="currentColor"/>
      <circle cx="8" cy="20" r="2" fill="currentColor"/>
      <circle cx="16" cy="20" r="2" fill="currentColor"/>
    </svg>`,
    iterator: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2"/>
    </svg>`,
  }
  
  return icons[type] || icons.function
}
</script>

<template>
  <div ref="container" class="workflow-decoration-container"></div>
</template>

<style scoped>
.workflow-decoration-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.workflow-node-decoration {
  position: absolute;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: #00d4ff;
  box-shadow: 
    0 4px 12px rgba(0, 212, 255, 0.2),
    0 0 20px rgba(0, 212, 255, 0.1);
  transition: all 0.3s ease;
}

.workflow-node-decoration.agent {
  color: #00d4ff;
  border-color: rgba(0, 212, 255, 0.3);
}

.workflow-node-decoration.function {
  color: #7c3aed;
  border-color: rgba(124, 58, 237, 0.3);
}

.workflow-node-decoration.branch {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.3);
}

.workflow-node-decoration.parallel {
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.3);
}

.workflow-node-decoration.iterator {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

@keyframes fadeInFloat {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }
  100% {
    opacity: 0.6;
    transform: translateY(0) scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .workflow-decoration-container {
    display: none;
  }
}
</style>
