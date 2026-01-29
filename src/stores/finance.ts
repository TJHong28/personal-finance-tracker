import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFinanceStore = defineStore('finance', () => {
  // 1. State: Our data "Source of Truth"
  const transactions = ref<any[]>([])
  const monthlyBudget = ref(2000) // Default budget

  // 2. Getters: Automatic calculations (Scalability)
  const totalBalance = computed(() => {
    return transactions.value.reduce((acc, t) => t.type === 'income' ? acc + t.amount : acc - t.amount, 0)
  })

  const totalExpenses = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0)
  })

  const isOverBudget = computed(() => totalExpenses.value > monthlyBudget.value)

  // 3. Actions: Methods to change data (Modularity)
  function addTransaction(transaction: any) {
    transactions.value.push({ ...transaction, id: Date.now(), date: new Date().toISOString() })
  }

  return { transactions, monthlyBudget, totalBalance, totalExpenses, isOverBudget, addTransaction }
})