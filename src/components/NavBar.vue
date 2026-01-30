<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../stores/finance'

const router = useRouter()
const store = useFinanceStore()

const handleLogout = () => {
  // Clear any session state if needed (optional for now)
  router.push('/')
}
</script>

<template>
  <nav class="navbar">
    <div class="brand">
      <span class="logo">💰</span>
      <span class="title">MyFinance</span>
    </div>
    
    <div class="links">
      <router-link to="/dashboard" active-class="active">Dashboard</router-link>
      <router-link to="/add" active-class="active">Add New</router-link>
      <router-link to="/reports" active-class="active">Reports</router-link>
    </div>

    <button @click="handleLogout" class="btn-logout">Logout</button>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.brand { display: flex; align-items: center; gap: 10px; font-weight: bold; font-size: 1.2rem; }
.logo { font-size: 1.5rem; }

.links { display: flex; gap: 20px; }
.links a { 
  text-decoration: none; 
  color: #64748b; 
  font-weight: 500; 
  padding: 5px 10px;
  border-radius: 6px;
  transition: all 0.2s;
}

.links a:hover { color: #2563eb; background: #eff6ff; }
.links a.active { color: #2563eb; font-weight: bold; background: #eff6ff; }

.btn-logout { 
  background: none; 
  border: 1px solid #e2e8f0; 
  padding: 8px 16px; 
  border-radius: 6px; 
  cursor: pointer; 
  color: #64748b;
  transition: all 0.2s;
}
.btn-logout:hover { border-color: #ef4444; color: #ef4444; }
</style>