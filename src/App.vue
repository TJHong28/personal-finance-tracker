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
/* 1. Global Reset to remove default browser spacing */
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
}

/* 2. Ensure the Vue app takes up the full width */
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 3. The main layout container */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 4. The Content Area - This is where the magic happens */
.content {
  flex: 1;
  width: 100%;
  max-width: 1200px; /* Prevents it from getting too wide on huge screens */
  margin: 0 auto;    /* Centers the container horizontally */
  padding: 0 20px;   /* Adds a little breathing room on the sides */
  box-sizing: border-box;
}
</style>