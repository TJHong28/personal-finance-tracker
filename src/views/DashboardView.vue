<script setup lang="ts">
import { useFinanceStore } from '../stores/finance'
import { useRouter } from 'vue-router'

const store = useFinanceStore()
const router = useRouter()
</script>

<template>
  <div class="dashboard">
    <header>
      <h1>Financial Overview</h1>
      <button @click="router.push('/add')" class="btn-add">+ Add Transaction</button>
    </header>

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
      ⚠️ Warning: You have exceeded your monthly budget of RM {{ store.monthlyBudget }}!
    </div>

    <section class="recent-transactions">
      <div class="section-header">
        <h2>Recent Transactions</h2>
        <button @click="router.push('/reports')" class="btn-link">View Reports &rarr;</button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in store.transactions" :key="t.id">
            <td>{{ t.category }}</td>
            <td :class="t.type === 'income' ? 'text-success' : 'text-danger'">
              {{ t.type === 'income' ? '+' : '-' }} RM {{ t.amount.toFixed(2) }}
            </td>
          </tr>
          <tr v-if="store.transactions.length === 0">
            <td colspan="2" class="empty-state">No transactions yet. Add one!</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
.dashboard { max-width: 800px; margin: 0 auto; padding: 20px; }
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
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
</style>