<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useRouter } from 'vue-router'

const store = useFinanceStore()
const router = useRouter()

// --- 1. State Variables ---
const searchQuery = ref('')
const filterType = ref('All')
const selectedMonth = ref(new Date().toISOString().slice(0, 7))
const sortKey = ref('date') 
const sortOrder = ref('desc')
const isEditingBudget = ref(false)
const newBudget = ref(store.monthlyBudget)

// --- 2. Helper Functions ---
const formatDate = (dateString: string) => {
  if (!dateString) return 'Today'
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { 
    style: 'currency', 
    currency: store.currency 
  })
}

const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'desc'
  }
}

// --- 3. Compute Logic ---
const filteredTransactions = computed(() => {
  let result = store.transactions.filter(t => {
    const matchesMonth = t.date.startsWith(selectedMonth.value)
    const matchesSearch = t.category.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (t.notes && t.notes.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesType = filterType.value === 'All' || t.type === filterType.value.toLowerCase()
    return matchesMonth && matchesSearch && matchesType
  })

  return result.sort((a, b) => {
    const modifier = sortOrder.value === 'asc' ? 1 : -1
    if (sortKey.value === 'date') return (new Date(a.date).getTime() - new Date(b.date).getTime()) * modifier
    else if (sortKey.value === 'amount') return (a.amount - b.amount) * modifier
    else if (sortKey.value === 'category') return a.category.localeCompare(b.category) * modifier
    return 0
  })
})

const monthlyExpenses = computed(() => {
  return store.transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(selectedMonth.value))
    .reduce((acc, t) => acc + t.amount, 0)
})

const isOverBudget = computed(() => {
  if (!selectedMonth.value) return false
  return monthlyExpenses.value > store.monthlyBudget
})

// --- 4. Actions ---
const saveBudget = () => {
  if (newBudget.value > 0) {
    store.setBudget(newBudget.value)
    isEditingBudget.value = false
  }
}

const exportToCSV = () => {
  const headers = ['Date', 'Category', 'Type', 'Amount', 'Notes']
  const rows = filteredTransactions.value.map(t => {
    const dateObj = new Date(t.date)
    const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split('T')[0] : 'Invalid Date'
    return [dateStr, `"${t.category}"`, t.type, t.amount.toFixed(2), `"${t.notes || ''}"`]
  })

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `finance_export_${selectedMonth.value}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="dashboard-wrapper">
    <div class="layout-container">
      
      <header class="main-header">
        <div>
          <h1>Financial Overview</h1>
          <p class="subtitle">Welcome back, here is your financial health.</p>
        </div>
        <div class="header-actions">
          <button @click="exportToCSV" class="btn-secondary">
            📥 Export CSV
          </button>
          <button @click="router.push('/add')" class="btn-primary">
            + Add Transaction
          </button>
        </div>
      </header>

      <div class="budget-strip">
        <div v-if="!isEditingBudget" class="budget-view">
          <span class="label">Monthly Budget Target:</span>
          <span class="value">{{ formatCurrency(store.monthlyBudget) }}</span>
          <button @click="isEditingBudget = true" class="link-btn">Edit</button>
        </div>
        <div v-else class="budget-edit">
          <input v-model.number="newBudget" type="number" class="input-inline" />
          <button @click="saveBudget" class="btn-xs-primary">Save</button>
          <button @click="isEditingBudget = false" class="btn-xs-secondary">Cancel</button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card balance-card">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <h3>Total Balance</h3>
            <p class="amount">{{ formatCurrency(store.totalBalance) }}</p>
            <small class="text-muted">All time net worth</small>
          </div>
        </div>

        <div class="stat-card expense-card" :class="{ 'over-budget': isOverBudget }">
          <div class="card-icon">📉</div>
          <div class="card-content">
            <h3>Monthly Spending</h3>
            <p class="amount" :class="{ 'text-danger': isOverBudget }">
              {{ formatCurrency(monthlyExpenses) }}
            </p>
            <small class="text-muted">
              {{ selectedMonth ? `In ${selectedMonth}` : 'All Time View' }}
            </small>
          </div>
        </div>
      </div>

      <div v-if="isOverBudget" class="alert-banner">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <strong>Budget Exceeded!</strong>
          <p>You have spent more than {{ formatCurrency(store.monthlyBudget) }} this month.</p>
        </div>
      </div>

      <section class="transactions-panel">
        <div class="panel-header">
          <h2>Recent Transactions</h2>
        </div>

        <div class="toolbar">
          <div class="filter-group">
            <input v-model="selectedMonth" type="month" class="input-control month-picker" />
            <select v-model="filterType" class="input-control select-picker">
              <option value="All">All Types</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          
          <div class="search-group">
            <input v-model="searchQuery" type="text" placeholder="Search transactions..." class="input-control search-bar" />
          </div>
        </div>
        
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th @click="sortBy('date')" class="sortable">
                  Date <span class="arrow" v-if="sortKey === 'date'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th @click="sortBy('category')" class="sortable">
                  Category <span class="arrow" v-if="sortKey === 'category'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th @click="sortBy('amount')" class="sortable amount-col">
                  Amount <span class="arrow" v-if="sortKey === 'amount'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                </th>
                <th class="action-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in filteredTransactions" :key="t.id">
                <td class="date-cell">{{ formatDate(t.date) }}</td>
                <td>
                  <div class="cat-name">{{ t.category }}</div>
                  <div class="cat-note" v-if="t.notes">{{ t.notes }}</div>
                </td>
                <td class="amount-col">
                  <span :class="['badge', t.type === 'income' ? 'badge-success' : 'badge-danger']">
                    {{ t.type === 'income' ? '+' : '-' }} {{ formatCurrency(t.amount) }}
                  </span>
                </td>
                <td class="action-col">
                  <div class="action-buttons">
                    <button @click="router.push(`/edit/${t.id}`)" class="btn-icon" title="Edit">✏️</button>
                    <button @click="store.removeTransaction(t.id)" class="btn-icon delete" title="Delete">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="4" class="empty-state">
                  <div class="empty-icon">📂</div>
                  <p>No transactions found for this period.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 0;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
}

/* --- 2. Header --- */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 30px;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  margin: 0;
  color: #0f172a; /* Slate 900 */
}

.subtitle {
  color: #64748b;
  margin: 5px 0 0 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* --- 3. Buttons --- */
button { cursor: pointer; transition: all 0.2s ease; border: none; font-weight: 600; font-size: 0.9rem; }

.btn-primary {
  background-color: #4f46e5; /* Indigo 600 */
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
}
.btn-primary:hover { background-color: #4338ca; transform: translateY(-1px); }

.btn-secondary {
  background-color: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  padding: 10px 16px;
  border-radius: 8px;
}
.btn-secondary:hover { background-color: #f1f5f9; color: #0f172a; }

/* --- 4. Budget Strip --- */
.budget-strip {
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 25px;
  border: 1px solid #f1f5f9;
}
.label { color: #64748b; margin-right: 10px; font-weight: 500; }
.value { font-weight: 700; font-size: 1.1rem; color: #0f172a; margin-right: 15px; }
.link-btn { color: #4f46e5; background: none; text-decoration: underline; font-size: 0.9rem; padding: 0; }

.input-inline { padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; width: 100px; margin-right: 10px; }
.btn-xs-primary { background: #4f46e5; color: white; padding: 6px 12px; border-radius: 6px; margin-right: 5px; font-size: 0.8rem; }
.btn-xs-secondary { background: #e2e8f0; color: #475569; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; }

/* --- 5. Stats Grid --- */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: flex-start;
  gap: 20px;
  border: 1px solid #f1f5f9;
}

.card-icon {
  width: 50px;
  height: 50px;
  background: #eef2ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-content h3 { margin: 0; font-size: 0.9rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
.amount { font-size: 2.2rem; font-weight: 800; margin: 5px 0; letter-spacing: -0.03em; }
.text-muted { color: #94a3b8; font-size: 0.85rem; }

.over-budget { border: 1px solid #fecaca; background: #fff1f2; }
.text-danger { color: #dc2626; }

/* --- 6. Transactions Panel --- */
.transactions-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

.panel-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; }
.panel-header h2 { margin: 0; font-size: 1.25rem; font-weight: 700; }

/* Toolbar */
.toolbar {
  padding: 16px 24px;
  background: #f8fafc;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.filter-group, .search-group { display: flex; gap: 10px; }
.search-group { flex: 1; justify-content: flex-end; }

.input-control {
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  color: #334155;
}
.input-control:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1); }
.search-bar { width: 100%; max-width: 300px; }

/* Table */
table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 14px 24px; background: #f8fafc; font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; color: #334155; }
tr:last-child td { border-bottom: none; }
tr:hover td { background-color: #f8fafc; }

.sortable { cursor: pointer; }
.sortable:hover { color: #4f46e5; }

/* Column Specifics */
.date-cell { font-family: 'Monaco', monospace; font-size: 0.85rem; color: #64748b; }
.cat-name { font-weight: 600; color: #0f172a; }
.cat-note { font-size: 0.8rem; color: #94a3b8; }
.amount-col { text-align: right; }
.action-col { text-align: right; width: 100px; }

/* Badges for Amount */
.badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 0.9rem; }
.badge-success { color: #059669; background: #d1fae5; }
.badge-danger { color: #dc2626; background: #fee2e2; }

/* Action Buttons */
.action-buttons { display: flex; justify-content: flex-end; gap: 8px; }
.btn-icon { background: white; border: 1px solid #e2e8f0; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1rem; color: #64748b; transition: all 0.2s; }
.btn-icon:hover { border-color: #4f46e5; color: #4f46e5; transform: translateY(-1px); }
.btn-icon.delete:hover { border-color: #ef4444; color: #ef4444; }

/* Alert */
.alert-banner { background: #fff1f2; border-left: 4px solid #f43f5e; padding: 16px; margin-bottom: 24px; border-radius: 8px; display: flex; gap: 12px; align-items: flex-start; }
.alert-icon { font-size: 1.5rem; }
.alert-content strong { color: #be123c; display: block; margin-bottom: 4px; }
.alert-content p { margin: 0; color: #881337; font-size: 0.95rem; }

.empty-state { text-align: center; padding: 60px 20px; }
.empty-icon { font-size: 3rem; margin-bottom: 10px; opacity: 0.5; }

.layout-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>