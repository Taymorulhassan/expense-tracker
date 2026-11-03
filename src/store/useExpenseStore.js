import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useExpenseStore = create(
  persist(
    (set, get) => ({
      expenses: [],
      
      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            {
              id: Date.now().toString(),
              ...expense,
              date: expense.date || new Date().toISOString().slice(0, 10),
            },
            ...state.expenses,
          ],
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      getTotal: () => {
        return get().expenses.reduce((sum, e) => sum + Number(e.amount), 0)
      },
    }),
    {
      name: 'expense-storage',
    }
  )
)

export default useExpenseStore