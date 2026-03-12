import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 1. Define exactly what a "User" looks like for TypeScript
interface User {
  email: string;
  password?: string; 
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  const savedUser = localStorage.getItem('currentUser')
  const currentUser = ref<User | null>(savedUser ? JSON.parse(savedUser) : null)

  const isAuthenticated = computed(() => currentUser.value !== null)

  // 2. Explicitly type email and password as 'string'
  function register(email: string, password: string) {
    // 3. Tell TypeScript that this array holds 'User' objects
    const users: User[] = JSON.parse(localStorage.getItem('users_db') || '[]')
    
    // 4. Explicitly type 'u' as a 'User'
    const userExists = users.find((u: User) => u.email === email)
    if (userExists) {
      return { success: false, message: 'Email is already registered.' }
    }

    users.push({ email, password })
    localStorage.setItem('users_db', JSON.stringify(users))
    
    login(email, password)
    return { success: true }
  }

  // 5. Apply the same types to login
  function login(email: string, password: string) {
    const users: User[] = JSON.parse(localStorage.getItem('users_db') || '[]')
    
    const validUser = users.find((u: User) => u.email === email && u.password === password)
    
    if (validUser) {
      currentUser.value = { email: validUser.email }
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      return { success: true }
    } else {
      return { success: false, message: 'Invalid email or password.' }
    }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('currentUser')
    router.push('/')
  }

  return { currentUser, isAuthenticated, register, login, logout }
})