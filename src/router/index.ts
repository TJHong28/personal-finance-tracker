import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // lazy-loaded: this generates a separate chunk for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/add',
      name: 'add-transaction',
      component: () => import('../views/AddTransactionView.vue')
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsView.vue')
    }
  ]
})

export default router