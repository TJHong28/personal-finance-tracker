import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useFinanceStore = defineStore('finance', () => {
  // 1. State: Load from LocalStorage if available (Robustness)
  const savedData = localStorage.getItem('finance_data')
  const transactions = ref<any[]>(savedData ? JSON.parse(savedData) : [])
  
  // Load saved budget or default to 2000
  const savedBudget = localStorage.getItem('finance_budget')
  const monthlyBudget = ref(savedBudget ? Number(savedBudget) : 2000)

  // 2. Watchers: Auto-save changes (Persistence)
  watch(transactions, (newVal) => {
    localStorage.setItem('finance_data', JSON.stringify(newVal))
  }, { deep: true })

  watch(monthlyBudget, (newVal) => {
    localStorage.setItem('finance_budget', String(newVal))
  })

  // 3. Getters
  const totalBalance = computed(() => {
    return transactions.value.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0)
  })

  const totalExpenses = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0)
  })

  const isOverBudget = computed(() => totalExpenses.value > monthlyBudget.value)

  // 4. Actions
  function addTransaction(transaction: any) {
    transactions.value.push({ 
      ...transaction, 
      id: Date.now(), 
      // If the user provided a date, use it. Otherwise, use today.
      date: transaction.date || new Date().toISOString() 
    })
  }

  // Feature 5: Delete Logic
  function removeTransaction(id: number) {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  // Feature 6: Dynamic Budget Logic
  function setBudget(amount: number) {
    monthlyBudget.value = amount
  }

  return { 
    transactions, 
    monthlyBudget, 
    totalBalance, 
    totalExpenses, 
    isOverBudget, 
    addTransaction,
    removeTransaction, // Don't forget to export these!
    setBudget 
  }
})