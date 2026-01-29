<script setup lang="ts">
import { ref } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useRouter } from 'vue-router'

const store = useFinanceStore()
const router = useRouter()

const amount = ref<number>(0)
const category = ref('Food')
const type = ref<'income' | 'expense'>('expense')
const notes = ref('')

const categories = ['Food', 'Transport', 'Bills', 'Salary', 'Shopping', 'Entertainment']

const submitForm = () => {
  if (amount.value <= 0) {
    alert('Please enter a valid amount')
    return
  }
  
  store.addTransaction({
    amount: amount.value,
    category: category.value,
    type: type.value,
    notes: notes.value
  })

  router.push('/dashboard')
}
</script>

<template>
  <div class="add-container">
    <h2>Record New Transaction</h2>
    <form @submit.prevent="submitForm" class="finance-form">
      <div class="form-group">
        <label>Type</label>
        <select v-model="type">
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div class="form-group">
        <label>Amount (RM)</label>
        <input v-model.number="amount" type="number" step="0.01" required />
      </div>

      <div class="form-group">
        <label>Category</label>
        <select v-model="category">
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>Notes</label>
        <textarea v-model="notes" placeholder="What was this for?"></textarea>
      </div>

      <div class="actions">
        <button type="button" @click="router.push('/dashboard')" class="btn-cancel">Cancel</button>
        <button type="submit" class="btn-save">Save Transaction</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-container { max-width: 500px; margin: 40px auto; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 15px; display: flex; flex-direction: column; }
input, select, textarea { padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-top: 5px; }
.actions { display: flex; gap: 10px; margin-top: 20px; }
.btn-save { flex: 1; background: #2563eb; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; }
.btn-cancel { background: #f3f4f6; padding: 12px; border: none; border-radius: 6px; cursor: pointer; }
</style>