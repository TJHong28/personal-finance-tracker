<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

// We use the current route to decide if we should show the Navbar
const route = useRoute()
</script>

<template>
  <div class="app-container">
    <NavBar v-if="route.path !== '/'" />
    
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Global Reset */
body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  width: 100%;
}
</style>