<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Oops! The page you are looking for doesn't exist.</p>
    <button @click="router.push('/dashboard')">Go Home</button>
  </div>
</template>

<style scoped>
.not-found { text-align: center; margin-top: 100px; }
h1 { font-size: 6rem; margin: 0; color: #cbd5e1; }
button { background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; margin-top: 20px; }
</style>