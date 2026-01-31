<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useRouter, useRoute } from 'vue-router'

const store = useFinanceStore()
const router = useRouter()
const route = useRoute()

// --- LOGIC SECTION ---
const amount = ref<number | null>(null)
const category = ref('Food')
const type = ref<'expense' | 'income'>('expense')
const notes = ref('')
const date = ref(new Date().toISOString().split('T')[0])

const isEditing = ref(false)
const transactionId = ref<number>(0)

onMounted(() => {
  if (route.params.id) {
    isEditing.value = true
    transactionId.value = Number(route.params.id)
    const existingTransaction = store.transactions.find(t => t.id === transactionId.value)
    if (existingTransaction) {
      amount.value = existingTransaction.amount
      category.value = existingTransaction.category
      type.value = existingTransaction.type
      notes.value = existingTransaction.notes
      if (existingTransaction.date) {
         date.value = new Date(existingTransaction.date).toISOString().split('T')[0]
      }
    }
  }
})

const handleSubmit = () => {
  if (!amount.value || amount.value <= 0) {
    alert('Please enter a valid positive amount.')
    return
  }

  const transactionData = {
    amount: amount.value,
    category: category.value,
    type: type.value,
    notes: notes.value,
    date: date.value
  }

  if (isEditing.value) {
    store.editTransaction({ ...transactionData, id: transactionId.value })
  } else {
    store.addTransaction(transactionData)
  }
  router.push('/dashboard')
}
</script>

<template>
  <div class="page-wrapper">
    <div class="form-card">
      <header>
        <button @click="router.push('/dashboard')" class="btn-back">← Back</button>
        <h2>{{ isEditing ? 'Edit Transaction' : 'New Transaction' }}</h2>
      </header>
      
      <form @submit.prevent="handleSubmit">
        
        <div class="form-group">
          <label class="label">Transaction Type</label>
          <div class="type-grid">
            <label class="type-option" :class="{ 'active expense': type === 'expense' }">
              <input type="radio" value="expense" v-model="type" />
              <span class="icon">📉</span>
              <span class="text">Expense</span>
            </label>
            <label class="type-option" :class="{ 'active income': type === 'income' }">
              <input type="radio" value="income" v-model="type" />
              <span class="icon">💰</span>
              <span class="text">Income</span>
            </label>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label class="label">Date</label>
            <input v-model="date" type="date" class="input-control" required />
          </div>

          <div class="form-group half">
            <label class="label">Amount ({{ store.currency }})</label>
            <input 
              v-model="amount" 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              class="input-control"
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <label class="label">Category</label>
          <div class="select-wrapper">
            <select v-model="category" class="input-control">
              <option v-for="cat in store.categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>
          <small class="hint">Want more options? Go to <router-link to="/categories">Manage Categories</router-link></small>
        </div>

        <div class="form-group">
          <label class="label">Notes <span class="optional">(Optional)</span></label>
          <textarea v-model="notes" placeholder="e.g. Lunch at Nasi Kandar" class="input-control textarea"></textarea>
        </div>

        <div class="actions">
          <button type="button" @click="router.push('/dashboard')" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary">
            {{ isEditing ? 'Update Transaction' : 'Save Transaction' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Inter', sans-serif;
}

.form-card {
  background: white;
  width: 100%;
  max-width: 550px;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
  border: 1px solid #f1f5f9;
}

header {
  margin-bottom: 30px;
  text-align: center;
  position: relative;
}

h2 { margin: 10px 0 0; color: #0f172a; font-size: 1.5rem; }
.btn-back { position: absolute; left: 0; top: 0; background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; }
.btn-back:hover { color: #4f46e5; }

/* Form Controls */
.form-group { margin-bottom: 24px; }
.form-row { display: flex; gap: 20px; }
.half { flex: 1; }

.label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 0.9rem; }
.optional { font-weight: 400; color: #94a3b8; }

.input-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #fff;
  color: #0f172a;
  transition: all 0.2s;
  box-sizing: border-box; /* Fixes width issues */
}
.input-control:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
.textarea { min-height: 100px; resize: vertical; font-family: inherit; }

/* Custom Type Selector */
.type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.type-option {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 15px;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.type-option input { display: none; }
.type-option .icon { font-size: 1.5rem; margin-bottom: 5px; }
.type-option .text { font-weight: 600; color: #64748b; }

.type-option:hover { border-color: #e2e8f0; background: #f8fafc; }
.type-option.active.expense { border-color: #fca5a5; background: #fef2f2; }
.type-option.active.expense .text { color: #dc2626; }
.type-option.active.income { border-color: #6ee7b7; background: #ecfdf5; }
.type-option.active.income .text { color: #059669; }

/* Hint Link */
.hint { display: block; margin-top: 8px; font-size: 0.85rem; color: #94a3b8; }
.hint a { color: #4f46e5; text-decoration: none; font-weight: 500; }
.hint a:hover { text-decoration: underline; }

/* Actions */
.actions { display: flex; gap: 15px; margin-top: 30px; }
.btn-primary { flex: 2; background: #4f46e5; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: #4338ca; transform: translateY(-1px); }
.btn-secondary { flex: 1; background: white; color: #475569; border: 1px solid #e2e8f0; padding: 14px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-secondary:hover { background: #f8fafc; color: #0f172a; }
</style>