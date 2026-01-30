<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useRouter } from 'vue-router'

const store = useFinanceStore()
const router = useRouter()

// --- Feature: Search & Filter State ---
const searchQuery = ref('')
const filterType = ref('All') // Options: All, Income, Expense

// --- Feature: Dynamic Filtering Logic ---
const filteredTransactions = computed(() => {
  return store.transactions.filter(t => {
    // 1. Check if it matches the Search Query (Case insensitive)
    const matchesSearch = t.category.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          (t.notes && t.notes.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    // 2. Check if it matches the Dropdown Filter
    const matchesType = filterType.value === 'All' || t.type === filterType.value.toLowerCase()

    return matchesSearch && matchesType
  })
})

// --- Feature: Budget Editing Logic (From previous step) ---
const isEditingBudget = ref(false)
const newBudget = ref(store.monthlyBudget)

const saveBudget = () => {
  if (newBudget.value > 0) {
    store.setBudget(newBudget.value)
    isEditingBudget.value = false
  }
}

// --- Feature: Export Logic ---
const exportToCSV = () => {
  const headers = ['Date', 'Category', 'Type', 'Amount', 'Notes']
  
  const rows = store.transactions.map(t => {
    // FIX: Use robust YYYY-MM-DD format instead of local format
    // This handles the date object safely even if it's a string
    const dateObj = new Date(t.date)
    const dateStr = !isNaN(dateObj.getTime()) 
      ? dateObj.toISOString().split('T')[0] 
      : 'Invalid Date'

    return [
      dateStr,
      `"${t.category}"`,
      t.type,
      t.amount.toFixed(2),
      `"${t.notes || ''}"`
    ]
  })

  const csvContent = [
    headers.join(','), 
    ...rows.map(row => row.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `finance_export_${new Date().toISOString().slice(0,10)}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>  
  <div class="dashboard">
    <header>
      <h1>Financial Overview</h1>
      <div class="header-actions">
        <button @click="exportToCSV" class="btn-export">📥 Export CSV</button>
        <button @click="router.push('/add')" class="btn-add">+ Add Transaction</button>
    </div>
</header>

    <div class="budget-control">
      <div v-if="!isEditingBudget" class="budget-display">
        <span>Monthly Budget: <strong>RM {{ store.monthlyBudget }}</strong></span>
        <button @click="isEditingBudget = true" class="btn-text">Edit</button>
      </div>
      <div v-else class="budget-edit">
        <input v-model.number="newBudget" type="number" class="input-small" />
        <button @click="saveBudget" class="btn-save-small">Save</button>
        <button @click="isEditingBudget = false" class="btn-cancel-small">Cancel</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="card">
        <h3>Total Balance</h3>
        <p class="amount">RM {{ store.totalBalance.toFixed(2) }}</p>
      </div>
      <div class="card">
        <h3>Monthly Spending</h3>
        <p class="amount" :class="{ 'text-danger': store.isOverBudget }">
          RM {{ store.totalExpenses.toFixed(2) }}
        </p>
      </div>
    </div>

    <div v-if="store.isOverBudget" class="alert-box">
      ⚠️ Warning: You have exceeded your budget of RM {{ store.monthlyBudget }}!
    </div>

    <section class="recent-transactions">
      <div class="section-header">
        <h2>Transactions</h2>
        <button @click="router.push('/reports')" class="btn-link">View Reports &rarr;</button>
      </div>

      <div class="toolbar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="🔍 Search category or notes..." 
          class="search-input"
        />
        <select v-model="filterType" class="filter-select">
          <option value="All">All Types</option>
          <option value="expense">Expense Only</option>
          <option value="income">Income Only</option>
        </select>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th style="text-align: right;">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filteredTransactions" :key="t.id">
            <td>
              <div class="cat-name">{{ t.category }}</div>
              <div class="cat-note" v-if="t.notes">{{ t.notes }}</div>
            </td>
            <td :class="t.type === 'income' ? 'text-success' : 'text-danger'">
              {{ t.type === 'income' ? '+' : '-' }} RM {{ t.amount.toFixed(2) }}
            </td>
            <td style="text-align: right;">
              <button @click="store.removeTransaction(t.id)" class="btn-delete" title="Delete">
                🗑️
              </button>
            </td>
          </tr>
          <tr v-if="filteredTransactions.length === 0">
            <td colspan="3" class="empty-state">
              {{ searchQuery ? 'No matching transactions found.' : 'No transactions yet.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
/* Previous Styles ... */
.dashboard { max-width: 800px; margin: 0 auto; padding: 20px; }
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
.card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.amount { font-size: 2rem; font-weight: bold; margin-top: 10px; }
.text-danger { color: #ef4444; }
.text-success { color: #10b981; }
.alert-box { background: #fee2e2; border: 1px solid #ef4444; color: #b91c1c; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
.btn-add { background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; }
.btn-link { background: none; border: none; color: #2563eb; cursor: pointer; text-decoration: underline; }
.section-header { display: flex; justify-content: space-between; align-items: center; }
table { width: 100%; background: white; border-radius: 12px; border-collapse: collapse; margin-top: 10px; overflow: hidden; }
th, td { padding: 15px; text-align: left; border-bottom: 1px solid #f1f5f9; }
.empty-state { text-align: center; color: #94a3b8; padding: 30px; }

/* Styles for Budget Control */
.budget-control { background: #f1f5f9; padding: 10px 15px; border-radius: 8px; margin-bottom: 20px; display: flex; align-items: center; }
.budget-display, .budget-edit { width: 100%; display: flex; align-items: center; gap: 10px; }
.btn-text { background: none; border: none; color: #2563eb; text-decoration: underline; cursor: pointer; font-size: 0.9rem; }
.input-small { width: 100px; padding: 5px; border-radius: 4px; border: 1px solid #cbd5e1; }
.btn-save-small { background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
.btn-cancel-small { background: #94a3b8; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
.btn-delete { background: none; border: none; cursor: pointer; font-size: 1.2rem; transition: transform 0.2s; }
.btn-delete:hover { transform: scale(1.2); }

/* --- NEW STYLES FOR SEARCH TOOLBAR --- */
.toolbar {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  margin-bottom: 10px;
}
.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}
.filter-select {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}
.cat-name { font-weight: 500; }
.cat-note { font-size: 0.85rem; color: #64748b; margin-top: 2px; }

/* Update header to handle multiple buttons */
.header-actions {
  display: flex;
  gap: 10px;
}

.btn-export {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-export:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #0f172a;
}
</style>