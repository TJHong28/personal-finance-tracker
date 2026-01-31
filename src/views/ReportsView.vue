<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useRouter } from 'vue-router'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Pie, Bar } from 'vue-chartjs'

// 1. Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const store = useFinanceStore()
const router = useRouter()

// 2. State & Filters
const selectedMonth = ref(new Date().toISOString().slice(0, 7)) // Default: Current Month

// 3. Helper: Format Currency (Global Setting)
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { 
    style: 'currency', 
    currency: store.currency 
  })
}

// 4. Computed: Filter Transactions by Month
const filteredTransactions = computed(() => {
  return store.transactions.filter(t => t.date.startsWith(selectedMonth.value))
})

// 5. Computed: Calculate Totals for Cards
const totalIncome = computed(() => 
  filteredTransactions.value.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
)
const totalExpense = computed(() => 
  filteredTransactions.value.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0)
)
const netSavings = computed(() => totalIncome.value - totalExpense.value)

// 6. Computed: Prepare Data for PIE CHART (Expenses by Category)
const pieData = computed(() => {
  const categories: Record<string, number> = {}
  
  filteredTransactions.value
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount
    })

  return {
    labels: Object.keys(categories),
    datasets: [{
      backgroundColor: ['#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#8b5cf6', '#ef4444'],
      data: Object.values(categories)
    }]
  }
})

// 7. Computed: Prepare Data for BAR CHART (Daily Spending)
const barData = computed(() => {
  const days: Record<string, number> = {}
  
  filteredTransactions.value
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const day = new Date(t.date).getDate()
      days[day] = (days[day] || 0) + t.amount
    })

  return {
    labels: Object.keys(days).sort((a,b) => Number(a)-Number(b)),
    datasets: [{
      label: 'Daily Spending',
      backgroundColor: '#4f46e5',
      // FIX: Added '|| 0' to satisfy TypeScript strict null checks
      data: Object.keys(days).sort((a,b) => Number(a)-Number(b)).map(d => days[d] || 0)
    }]
  }
})

// Chart Options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const }
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="report-container">
      
      <header>
        <button @click="router.push('/dashboard')" class="btn-back">← Dashboard</button>
        <h1>Financial Analysis</h1>
        
        <div class="filter-wrapper">
          <label>Report Period:</label>
          <input v-model="selectedMonth" type="month" class="month-picker" />
        </div>
      </header>

      <div class="summary-grid">
        <div class="summary-card income">
          <span class="label">Total Income</span>
          <span class="value success">+ {{ formatCurrency(totalIncome) }}</span>
        </div>
        <div class="summary-card expense">
          <span class="label">Total Expense</span>
          <span class="value danger">- {{ formatCurrency(totalExpense) }}</span>
        </div>
        <div class="summary-card savings">
          <span class="label">Net Savings</span>
          <span class="value" :class="netSavings >= 0 ? 'success' : 'danger'">
            {{ formatCurrency(netSavings) }}
          </span>
        </div>
      </div>

      <div class="charts-grid" v-if="filteredTransactions.length > 0">
        <div class="chart-card">
          <h3>Expense Breakdown</h3>
          <div class="chart-wrapper">
            <Pie :data="pieData" :options="chartOptions" />
          </div>
        </div>

        <div class="chart-card">
          <h3>Daily Spending Trend</h3>
          <div class="chart-wrapper">
            <Bar :data="barData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="icon">📊</div>
        <p>No data found for {{ selectedMonth }}. Try changing the filter.</p>
      </div>

    </div>
  </div>
</template>

<style scoped>

.page-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 0;
  font-family: 'Inter', sans-serif;
}

.report-container {
  max-width: 1200px; 
  margin: 0 auto;
  /* CHANGE 2: Add the side padding here to match NavBar.vue */
  padding: 0 20px;
}

header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  gap: 15px;
}

h1 { font-size: 1.5rem; color: #0f172a; margin: 0; }
.btn-back { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; transition: color 0.2s; }
.btn-back:hover { color: #4f46e5; }

/* Filter Styling */
.filter-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 8px 16px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.filter-wrapper label { font-size: 0.9rem; color: #64748b; font-weight: 500; }
.month-picker { border: 1px solid #e2e8f0; padding: 6px 10px; border-radius: 6px; color: #0f172a; outline: none; }
.month-picker:focus { border-color: #4f46e5; }

/* Summary Cards */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  border: 1px solid #f1f5f9;
}

.summary-card .label { font-size: 0.85rem; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 5px; }
.summary-card .value { font-size: 1.5rem; font-weight: 700; }
.success { color: #10b981; }
.danger { color: #ef4444; }

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
}

h3 { margin: 0 0 20px 0; font-size: 1.1rem; color: #1e293b; text-align: center; }

.chart-wrapper {
  height: 300px;
  position: relative;
}

/* Empty State */
.empty-state { text-align: center; padding: 60px; color: #94a3b8; }
.empty-state .icon { font-size: 3rem; margin-bottom: 10px; opacity: 0.5; }
</style>