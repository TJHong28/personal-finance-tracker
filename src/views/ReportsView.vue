<script setup lang="ts">
import { computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const store = useFinanceStore()

const chartData = computed(() => {
  const categories = [...new Set(store.transactions.map(t => t.category))]
  const data = categories.map(cat => {
    return store.transactions
      .filter(t => t.category === cat && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  return {
    labels: categories,
    datasets: [{
      backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
      data: data
    }]
  }
})
</script>

<template>
  <div class="reports-container">
    <h2>Expense Distribution</h2>
    <div class="chart-wrapper">
      <Pie :data="chartData" />
    </div>
    <div class="summary">
      <p>Total Expenses tracked: <strong>RM {{ store.totalExpenses.toFixed(2) }}</strong></p>
    </div>
  </div>
</template>

<style scoped>
.reports-container { max-width: 600px; margin: 20px auto; text-align: center; }
.chart-wrapper { height: 400px; margin-top: 20px; }
.summary { margin-top: 20px; font-size: 1.2rem; }
</style>