import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useFinanceStore = defineStore('finance', () => {
  // --- STATE ---
  const savedData = localStorage.getItem('finance_data')
  const transactions = ref<any[]>(savedData ? JSON.parse(savedData) : [])
  
  const savedBudget = localStorage.getItem('finance_budget')
  const monthlyBudget = ref(savedBudget ? Number(savedBudget) : 2000)

  const defaultCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Salary', 'Healthcare', 'Shopping']
  const savedCats = localStorage.getItem('finance_categories')
  const categories = ref<string[]>(savedCats ? JSON.parse(savedCats) : defaultCategories)

  // NEW: Currency Setting (Default MYR)
  const savedCurrency = localStorage.getItem('finance_currency')
  const currency = ref(savedCurrency || 'MYR')

  // --- WATCHERS ---
  watch(transactions, (val) => localStorage.setItem('finance_data', JSON.stringify(val)), { deep: true })
  watch(monthlyBudget, (val) => localStorage.setItem('finance_budget', String(val)))
  watch(categories, (val) => localStorage.setItem('finance_categories', JSON.stringify(val)), { deep: true })
  
  // NEW: Save Currency
  watch(currency, (val) => localStorage.setItem('finance_currency', val))

  // --- GETTERS ---
  const totalBalance = computed(() => transactions.value.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0))
  const totalExpenses = computed(() => transactions.value.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0))
  const isOverBudget = computed(() => totalExpenses.value > monthlyBudget.value)

  // --- ACTIONS ---
  function addTransaction(t: any) {
    transactions.value.push({ ...t, id: Date.now(), date: t.date || new Date().toISOString() })
  }

  function editTransaction(updated: any) {
    const idx = transactions.value.findIndex(t => t.id === updated.id)
    if (idx !== -1) transactions.value[idx] = updated
  }

  function removeTransaction(id: number) {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  function setBudget(amount: number) {
    monthlyBudget.value = amount
  }

  function addCategory(name: string) {
    if (!categories.value.includes(name)) categories.value.push(name)
  }

  function deleteCategory(name: string) {
    categories.value = categories.value.filter(c => c !== name)
  }

  function updateCategory(oldName: string, newName: string) {
    const idx = categories.value.indexOf(oldName)
    if (idx !== -1) {
      categories.value[idx] = newName
      transactions.value.forEach(t => { if (t.category === oldName) t.category = newName })
    }
  }

  function resetApp() {
    transactions.value = []
    monthlyBudget.value = 2000
    categories.value = defaultCategories
    currency.value = 'MYR'
    localStorage.clear()
  }

  return { 
    transactions, monthlyBudget, categories, currency, // Export currency
    totalBalance, totalExpenses, isOverBudget, 
    addTransaction, removeTransaction, editTransaction, setBudget,
    addCategory, deleteCategory, updateCategory,
    resetApp // Export reset
  }
})