<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = () => {
  errorMessage.value = ''
  
  // 1. Basic Email Format Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  // 2. Basic Length Check (No complexity enforcement here)
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.'
    return
  }

  // 3. Simulate Login
  isLoading.value = true
  setTimeout(() => {
    router.push('/dashboard')
  }, 1000)
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <div class="logo">💰</div>
        <h1>Welcome Back</h1>
        <p>Enter your credentials to access your finance dashboard.</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div v-if="errorMessage" class="error-banner">
          ⚠️ {{ errorMessage }}
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="name@example.com" 
            class="input-control" 
            :class="{ 'input-error': errorMessage && !email.includes('@') }"
            required
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            class="input-control" 
            :class="{ 'input-error': errorMessage && password.length < 6 }"
            required
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Don't have an account? <router-link to="/register">Create one</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Same consistent styles */
.auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f8fafc; padding: 20px; }
.auth-card { width: 100%; max-width: 420px; background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9; }
.auth-header { text-align: center; margin-bottom: 30px; }
.logo { font-size: 3rem; margin-bottom: 10px; }
h1 { font-size: 1.75rem; color: #0f172a; margin: 0 0 10px 0; font-weight: 700; }
p { color: #64748b; font-size: 0.95rem; margin: 0; line-height: 1.5; }
.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 0.9rem; }
.input-control { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 1rem; box-sizing: border-box; }
.input-control:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
.error-banner { background-color: #fef2f2; color: #dc2626; padding: 12px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 20px; border: 1px solid #fecaca; }
.input-error { border-color: #ef4444; background-color: #fff9f9; }
.btn-primary { width: 100%; background: #4f46e5; color: white; padding: 12px; border: none; border-radius: 10px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
.btn-primary:hover { background: #4338ca; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.auth-footer { text-align: center; margin-top: 25px; pt: 20px; border-top: 1px solid #f1f5f9; }
.auth-footer a { color: #4f46e5; font-weight: 600; text-decoration: none; }
</style>