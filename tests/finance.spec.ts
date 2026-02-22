// tests/finance.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useFinanceStore } from '../src/stores/finance' // Update this path if necessary
import { describe, it, expect, beforeEach } from 'vitest'

describe('Finance Store Operations', () => {
  beforeEach(() => {
    // Creates a fresh Pinia instance before each test
    setActivePinia(createPinia())
  })

  it('should accurately add an expense and calculate total', () => {
    const store = useFinanceStore()
    
    // Simulate adding a transaction
    store.addTransaction({ amount: 150, type: 'expense', category: 'Food', date: '2026-02-22' })
    
    // Assert that the array grew and the amount is correct
    expect(store.transactions.length).toBe(1)
    
    // Assuming you have a getter called totalExpenses
    expect(store.totalExpenses).toBe(150) 
  })
})