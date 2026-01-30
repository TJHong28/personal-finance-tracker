<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFinanceStore } from '../stores/finance'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

// 1. Register Chart.js components (Required for it to work)
ChartJS.register(ArcElement, Tooltip, Legend)

const store = useFinanceStore()
const router = useRouter()

// 2. Prepare Data for the Chart (Data Transformation Logic)
const chartData = computed(() => {
  // Get unique categories that have expenses
  const expenseTransactions = store.transactions.filter(t => t.type === 'expense')
  const categories = [...new Set(expenseTransactions.map(t => t.category))]
  
  // Sum up the amounts for each category
  const data = categories.map(cat => {
    return expenseTransactions
      .filter(t => t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0)
  })

  return {
    labels: categories,
    datasets: [{
      backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      data: data
    }]
  }
})

// Options to make the chart look nice
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}
</script>

<template>
  <div class="reports-container">
    <header>
      <button @click="router.push('/dashboard')" class="btn-back">&larr; Back to Dashboard</button>
      <h2>Expense Analysis</h2>
    </header>

    <div class="chart-card">
      <div v-if="store.totalExpenses > 0" class="chart-wrapper">
        <Pie :data="chartData" :options="chartOptions" />
      </div>
      
      <div v-else class="empty-state">
        <p>No expenses recorded yet.</p>
        <button @click="router.push('/add')" class="btn-link">Add an expense</button>
      </div>
    </div>

    <div class="summary-stats">
      <div class="stat-item">
        <span class="label">Total Income</span>
        <span class="value text-success">RM {{ store.transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0).toFixed(2) }}</span>
      </div>
      <div class="stat-item">
        <span class="label">Total Expenses</span>
        <span class="value text-danger">RM {{ store.totalExpenses.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reports-container { max-width: 600px; margin: 0 auto; padding: 20px; }
header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.btn-back { background: none; border: none; color: #64748b; cursor: pointer; font-size: 0.9rem; }
.btn-back:hover { text-decoration: underline; }

.chart-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); height: 400px; display: flex; justify-content: center; align-items: center; }
.chart-wrapper { width: 100%; height: 100%; }

.empty-state { text-align: center; color: #94a3b8; }
.btn-link { background: none; border: none; color: #2563eb; cursor: pointer; text-decoration: underline; margin-top: 5px; }

.summary-stats { margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.stat-item { background: white; padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
.label { display: block; color: #64748b; font-size: 0.9rem; margin-bottom: 5px; }
.value { font-size: 1.25rem; font-weight: bold; }
.text-success { color: #10b981; }
.text-danger { color: #ef4444; }
</style>