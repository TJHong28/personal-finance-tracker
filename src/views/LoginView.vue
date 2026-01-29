<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleLogin = () => {
  // For Task 2: We use mock logic first, then connect to Firebase
  if (email.value === 'admin@mail.com' && password.value === 'password123') {
    router.push('/dashboard')
  } else {
    errorMessage.value = 'Invalid credentials. Try admin@mail.com / password123'
  }
}

const seedData = () => {
  console.log('Seeding demo data...')
  // This will link to your Pinia store later
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Personal Finance Tracker</h1>
      <p>Log in to manage your budget</p>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="Enter email" required />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter password" required />
        </div>

        <button type="submit" class="btn-primary">Login</button>
        <button type="button" @click="seedData" class="btn-secondary">Seed Demo Data</button>
      </form>
      
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}
.form-group { margin-bottom: 1rem; }
input { width: 100%; padding: 0.5rem; margin-top: 0.25rem; }
.btn-primary { width: 100%; background: #2563eb; color: white; padding: 0.75rem; border: none; border-radius: 4px; cursor: pointer; }
.btn-secondary { width: 100%; background: #f3f4f6; margin-top: 0.5rem; padding: 0.75rem; border: none; cursor: pointer; }
.error { color: #ef4444; margin-top: 1rem; font-size: 0.9rem; }
</style>