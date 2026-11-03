import { useState } from 'react'
import useExpenseStore from './store/useExpenseStore'
import { format } from 'date-fns'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other']

// Entries saved before this change have no type, so treat them as debit.
const typeOf = (t) => (t.type === 'credit' ? 'credit' : 'debit')
const money = (n) => `₨ ${Number(n).toLocaleString()}`

const field =
  'w-full border-b border-neutral-300 bg-transparent py-2 text-sm outline-none ' +
  'placeholder:text-neutral-400 focus:border-neutral-900'

function App() {
  const { expenses, addExpense, deleteExpense } = useExpenseStore()
  const [type, setType] = useState('debit')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [note, setNote] = useState('')

  const totalDebit = expenses
    .filter((e) => typeOf(e) === 'debit')
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const totalCredit = expenses
    .filter((e) => typeOf(e) === 'credit')
    .reduce((sum, e) => sum + Number(e.amount), 0)
  const balance = totalCredit - totalDebit

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount)) return

    addExpense({ type, amount: Number(amount), category, note })

    setAmount('')
    setNote('')
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-md px-5 py-10">
        <h1 className="mb-10 text-lg font-medium">Expense Tracker</h1>

        {/* Summary */}
        <section className="mb-10">
          <p className="text-sm text-neutral-500">Balance</p>
          <p
            className={`mt-1 text-4xl font-light tabular-nums ${
              balance < 0 ? 'text-red-700' : 'text-neutral-900'
            }`}
          >
            {balance < 0 ? '−' : ''}
            {money(Math.abs(balance))}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6 border-t border-neutral-200 pt-4 text-sm">
            <div>
              <p className="text-neutral-500">Debit</p>
              <p className="mt-0.5 tabular-nums text-red-700">{money(totalDebit)}</p>
            </div>
            <div>
              <p className="text-neutral-500">Credit</p>
              <p className="mt-0.5 tabular-nums text-emerald-700">{money(totalCredit)}</p>
            </div>
          </div>
        </section>

        {/* Add transaction */}
        <form onSubmit={handleSubmit} className="mb-12 space-y-4">
          <div
            role="radiogroup"
            aria-label="Transaction type"
            className="grid grid-cols-2 border border-neutral-300 text-sm"
          >
            {['debit', 'credit'].map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={`py-2 capitalize transition-colors ${
                  type === t
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={field}
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={field}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={field}
          />

          <button
            type="submit"
            className="w-full bg-neutral-900 py-2.5 text-sm text-white transition-colors hover:bg-neutral-700"
          >
            Add transaction
          </button>
        </form>

        {/* Transactions */}
        {expenses.length === 0 ? (
          <p className="text-sm text-neutral-500">
            No transactions yet. Add your first one above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="py-2 pr-2 font-normal">Details</th>
                  <th className="px-2 py-2 text-right font-normal">Debit</th>
                  <th className="px-2 py-2 text-right font-normal">Credit</th>
                  <th className="w-6 py-2" />
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const isCredit = typeOf(expense) === 'credit'
                  return (
                    <tr key={expense.id} className="border-b border-neutral-100 align-top">
                      <td className="py-3 pr-2">
                        <p>{expense.category}</p>
                        <p className="text-xs text-neutral-500">
                          {format(new Date(expense.date), 'dd MMM yyyy')}
                          {expense.note && `, ${expense.note}`}
                        </p>
                      </td>
                      <td className="px-2 py-3 text-right tabular-nums text-red-700">
                        {!isCredit && money(expense.amount)}
                      </td>
                      <td className="px-2 py-3 text-right tabular-nums text-emerald-700">
                        {isCredit && money(expense.amount)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => deleteExpense(expense.id)}
                          aria-label="Delete transaction"
                          className="text-neutral-400 hover:text-neutral-900"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
