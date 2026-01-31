<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogout = () => {
  if (confirm('Are you sure you want to log out?')) {
    // FIX: Changed from '/login' to '/' because your login page is the root path
    router.push('/') 
  }
}
</script>

<template>
  <nav class="navbar">
    <div class="layout-container nav-inner">
      
      <div class="nav-left">
        <div class="brand">MyFinance</div>
        <div class="links">
          <router-link to="/dashboard" active-class="active">Dashboard</router-link>
          <router-link to="/reports" active-class="active">Reports</router-link>
          <router-link to="/categories" active-class="active">Categories</router-link>
        </div>
      </div>

      <div class="nav-right">
        <router-link to="/settings" class="nav-icon" title="Settings">⚙️</router-link>
        <div class="divider"></div>
        <button @click="handleLogout" class="btn-logout">Logout</button>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.navbar {
  width: 100%;
  height: 70px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-inner {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Left Side */
.nav-left { display: flex; align-items: center; gap: 40px; }
.brand { font-size: 1.25rem; font-weight: 800; color: #4f46e5; letter-spacing: -0.025em; }
.links { display: flex; gap: 20px; }
.links a { text-decoration: none; color: #64748b; font-weight: 500; font-size: 0.95rem; padding: 8px 12px; border-radius: 8px; transition: all 0.2s; }
.links a:hover { background: #f8fafc; color: #0f172a; }
.links a.active { background: #eef2ff; color: #4f46e5; font-weight: 600; }

/* Right Side */
.nav-right { display: flex; align-items: center; gap: 15px; }
.nav-icon { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; color: #64748b; text-decoration: none; font-size: 1.2rem; transition: background 0.2s; }
.nav-icon:hover { background: #f1f5f9; color: #0f172a; }
.divider { width: 1px; height: 24px; background: #e2e8f0; }
.btn-logout { background: white; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; color: #ef4444; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
.btn-logout:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
</style>