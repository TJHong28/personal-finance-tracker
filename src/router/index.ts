import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      // FIX 1: Add this meta tag
      meta: { hideNavbar: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      // FIX 2: Add it here too
      meta: { hideNavbar: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('../views/AddTransactionView.vue')
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: () => import('../views/AddTransactionView.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsView.vue')
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoryManagerView.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsView.vue')
    }
  ]
})

export default router