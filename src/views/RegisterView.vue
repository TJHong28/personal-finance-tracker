<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleRegister = () => {
  // 1. Reset Error
  errorMessage.value = ''

  // 2. Validate Password Match
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match."
    return
  }
  
  // 3. Validate Password Complexity (Strict Policy)
  // At least 1 Upper, 1 Lower, 1 Special, Min 6 chars
  const strictPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/
  if (!strictPasswordRegex.test(password.value)) {
    errorMessage.value = "Password must have 1 uppercase, 1 lowercase, 1 special character, and be 6+ chars."
    return
  }

  // 4. Simulate API Call
  isLoading.value = true
  setTimeout(() => {
    alert("Account created successfully!")
    router.push('/') // Redirect to Login
  }, 1000)
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>Create Account</h1>
        <p>Join MyFinance to start tracking your wealth today.</p>
      </div>

      <form @submit.prevent="handleRegister">
        <div v-if="errorMessage" class="error-banner">
          ⚠️ {{ errorMessage }}
        </div>

        <div class="form-group">
          <label>Full Name</label>
          <input v-model="name" type="text" placeholder="John Doe" class="input-control" required />
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="name@example.com" class="input-control" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Enter strong password" 
            class="input-control" 
            :class="{ 'input-error': errorMessage.includes('Password') }"
            required 
          />
          <small class="hint">Must include uppercase, lowercase, & symbol.</small>
        </div>

        <div class="form-group">
          <label>Confirm Password</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="Re-enter password" 
            class="input-control" 
            :class="{ 'input-error': errorMessage.includes('match') }"
            required 
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Already have an account? <router-link to="/">Sign In</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Reuse styles from LoginView or keep existing styles */
.auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #f8fafc; padding: 20px; }
.auth-card { width: 100%; max-width: 480px; background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9; }
.auth-header { text-align: center; margin-bottom: 30px; }
h1 { font-size: 1.75rem; color: #0f172a; margin: 0 0 10px 0; font-weight: 700; }
p { color: #64748b; font-size: 0.95rem; margin: 0; line-height: 1.5; }
.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 0.9rem; }
.input-control { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 1rem; box-sizing: border-box; }
.input-control:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
.hint { font-size: 0.75rem; color: #64748b; margin-top: 5px; display: block; }
.btn-primary { width: 100%; background: #4f46e5; color: white; padding: 12px; border: none; border-radius: 10px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.2s; margin-top: 10px; }
.btn-primary:hover { background: #4338ca; }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
.error-banner { background-color: #fef2f2; color: #dc2626; padding: 12px; border-radius: 8px; font-size: 0.85rem; margin-bottom: 20px; border: 1px solid #fecaca; }
.input-error { border-color: #ef4444; background-color: #fff9f9; }
.auth-footer { text-align: center; margin-top: 25px; pt: 20px; border-top: 1px solid #f1f5f9; }
.auth-footer a { color: #4f46e5; font-weight: 600; text-decoration: none; }
</style>