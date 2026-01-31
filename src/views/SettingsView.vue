<script setup lang="ts">
import { ref } from 'vue'
import { useFinanceStore } from '../stores/finance'
import { useRouter } from 'vue-router'

const store = useFinanceStore()
const router = useRouter()

const budgetInput = ref(store.monthlyBudget)
const selectedCurrency = ref(store.currency)

const handleSave = () => {
  store.setBudget(budgetInput.value)
  store.currency = selectedCurrency.value
  alert('Settings Saved Successfully!')
}

const handleReset = () => {
  if (confirm('⚠️ DANGER: This will delete ALL transactions and categories. Are you sure?')) {
    store.resetApp()
    alert('System Reset Complete.')
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="page-wrapper">
    <div class="wide-container">
      <div class="settings-card">
        <header>
          <button @click="router.push('/dashboard')" class="btn-back">← Dashboard</button>
          <h1>System Settings</h1>
        </header>

        <div class="content">
          <section class="section">
            <h3>General Preferences</h3>
            <p class="desc">Customize how the application looks and behaves.</p>
            
            <div class="form-group">
              <label class="label">Monthly Budget Target</label>
              <div class="input-with-prefix">
                <span class="prefix">{{ store.currency }}</span>
                <input v-model.number="budgetInput" type="number" class="input-control" />
              </div>
            </div>

            <div class="form-group">
              <label class="label">Display Currency</label>
              <select v-model="selectedCurrency" class="input-control">
                <option value="MYR">MYR (Ringgit Malaysia)</option>
                <option value="USD">USD (US Dollar)</option>
                <option value="SGD">SGD (Singapore Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound)</option>
              </select>
            </div>

            <button @click="handleSave" class="btn-primary">Save Preferences</button>
          </section>

          <hr class="divider" />

          <section class="section danger-zone">
            <div class="danger-header">
              <h3>Data Management</h3>
              <span class="badge-danger">Caution</span>
            </div>
            <p class="desc">Resetting the application will permanently delete all transactions, categories, and settings. This action cannot be undone.</p>
            <button @click="handleReset" class="btn-danger">⚠️ Factory Reset App</button>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Reuse base page styles */
.page-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 40px 20px;
  display: flex; justify-content: center;
  font-family: 'Inter', sans-serif;
}

.settings-card {
  background: white;
  width: 100%; max-width: 600px;
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  height: fit-content;
}

header {
  padding: 30px;
  border-bottom: 1px solid #f1f5f9;
  display: flex; align-items: center; gap: 20px;
}
header h1 { margin: 0; font-size: 1.25rem; color: #0f172a; }
.btn-back { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; transition: color 0.2s; }
.btn-back:hover { color: #4f46e5; }

.content { padding: 30px; }

.section { margin-bottom: 10px; }
h3 { margin: 0 0 8px 0; color: #1e293b; font-size: 1.1rem; }
.desc { margin: 0 0 24px 0; color: #64748b; font-size: 0.9rem; line-height: 1.5; }

.form-group { margin-bottom: 20px; }
.label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 0.9rem; }

.input-control {
  width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 1rem; color: #0f172a;
}
.input-control:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }

.input-with-prefix { display: flex; align-items: center; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
.input-with-prefix .prefix { background: #f8fafc; padding: 12px 16px; border-right: 1px solid #e2e8f0; color: #64748b; font-weight: 600; font-size: 0.9rem; }
.input-with-prefix .input-control { border: none; border-radius: 0; }
.input-with-prefix:focus-within { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }

.btn-primary {
  width: 100%; background: #4f46e5; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-primary:hover { background: #4338ca; }

.divider { border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0; }

/* Danger Zone */
.danger-zone { background: #fff1f2; padding: 20px; border-radius: 16px; border: 1px solid #fecaca; }
.danger-zone h3 { color: #881337; }
.danger-zone .desc { color: #9f1239; }
.danger-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.badge-danger { background: #fecaca; color: #881337; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }

.btn-danger {
  width: 100%; background: white; color: #dc2626; border: 1px solid #fecaca; padding: 12px; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.btn-danger:hover { background: #fee2e2; border-color: #fca5a5; }
</style>