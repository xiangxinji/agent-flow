<template>
  <div class="home">
    <div class="content">
      <h1>AgentFlow</h1>
      <p>可视化工作流编辑器</p>
      <router-link to="/editor" class="btn">打开编辑器</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #1a1a1a;
}

.content {
  text-align: center;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
}

p {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.875rem 2rem;
  background: #42b883;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn:hover {
  background: #35a870;
  transform: translateY(-2px);
}
</style>
