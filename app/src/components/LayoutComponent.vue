<template>
  <div class="layout">
    <header class="header">
      <div class="logo">
        <router-link to="/">AgentFlow</router-link>
      </div>
      <nav class="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/editor">Editor</router-link>
      </nav>
    </header>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: #2c3e50;
  color: white;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.logo a:hover {
  color: #42b883;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav a.router-link-active {
  background: #42b883;
}

.main {
  flex: 1;
  overflow: auto;
}
</style>
