import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { hideNavbar: true } // Public
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { hideNavbar: true } // Public
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true } // Protected
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('../views/AddTransactionView.vue'),
      meta: { requiresAuth: true } // Protected
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('../views/AddTransactionView.vue'),
      meta: { requiresAuth: true } // Protected
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue'),
      meta: { requiresAuth: true } // Protected
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryManagerView.vue'),
      meta: { requiresAuth: true } // Protected
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsView.vue'),
      meta: { requiresAuth: true } // Protected
    }
  ]
})

// --- NAVIGATION GUARD ---
// This runs every single time the user tries to change a page/URL
router.beforeEach((to, from, next) => {
  // We call the store inside the guard to ensure Pinia is fully loaded first
  const authStore = useAuthStore()

  // 1. If the route is protected AND the user is NOT logged in:
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/') // Kick them back to the login page (path: '/')
  } 
  // 2. Optional UX: If they ARE logged in, stop them from going back to the login/register pages
  else if ((to.path === '/' || to.path === '/register') && authStore.isAuthenticated) {
    next('/dashboard') // Send them to the dashboard instead
  } 
  // 3. Otherwise, let them proceed normally
  else {
    next()
  }
})

export default router