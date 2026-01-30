<script setup lang="ts">
import { ref } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useRouter } from 'vue-router'

const store = useFinanceStore()
const router = useRouter()

// Reactive state for form inputs
const amount = ref<number | null>(null)
const category = ref('Food')
const type = ref<'expense' | 'income'>('expense')
const notes = ref('')

// Pre-defined categories for better Usability (Task 4)
const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Salary', 'Healthcare', 'Shopping']

const handleSubmit = () => {
  // 1. Validation Logic (Robustness)
  if (!amount.value || amount.value <= 0) {
    alert('Please enter a valid positive amount.')
    return
  }

  // 2. Call the Pinia Action
  store.addTransaction({
    amount: amount.value,
    category: category.value,
    type: type.value,
    notes: notes.value
  })

  // 3. Redirect back to Dashboard
  router.push('/dashboard')
}
</script>

<template>
  <div class="add-container">
    <h2>Record New Transaction</h2>
    
    <form @submit.prevent="handleSubmit" class="transaction-form">
      <div class="form-group">
        <label>Type</label>
        <div class="type-selector">
          <label :class="{ active: type === 'expense' }">
            <input type="radio" value="expense" v-model="type" /> Expense
          </label>
          <label :class="{ active: type === 'income' }">
            <input type="radio" value="income" v-model="type" /> Income
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>Amount (RM)</label>
        <input 
          v-model="amount" 
          type="number" 
          step="0.01" 
          placeholder="0.00" 
          required 
        />
      </div>

      <div class="form-group">
        <label>Category</label>
        <select v-model="category">
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Notes (Optional)</label>
        <textarea v-model="notes" placeholder="e.g. Lunch at Nasi Kandar"></textarea>
      </div>

      <div class="actions">
        <button type="button" @click="router.push('/dashboard')" class="btn-cancel">Cancel</button>
        <button type="submit" class="btn-save">Save Transaction</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.add-container {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

h2 { margin-bottom: 20px; text-align: center; }

.form-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; font-weight: 500; }

input[type="number"], select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

/* Custom Radio Styling for better UX */
.type-selector { display: flex; gap: 10px; }
.type-selector label {
  flex: 1;
  text-align: center;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.type-selector input { display: none; } /* Hide actual radio buttons */
.type-selector label.active {
  background-color: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
  font-weight: bold;
}

.actions { display: flex; gap: 15px; margin-top: 30px; }
.btn-save { flex: 2; background: #2563eb; color: white; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
.btn-cancel { flex: 1; background: #f1f5f9; color: #64748b; padding: 12px; border: none; border-radius: 8px; cursor: pointer; }
</style>