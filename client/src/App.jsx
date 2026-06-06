import { useState } from "react";
import { useExpenses } from "./hooks/useExpenses";
import FilterBar from "./components/FilterBar";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseForm from "./components/ExpenseForm";
import SummaryPanel from "./components/SummaryPanel";
import CategoryChart from "./components/CategoryChart";
import BudgetManager from "./components/BudgetManager";
import { exportExpensesToCSV } from "./utils/csvExport";

export default function App() {
  const {
    expenses,
    summary,
    budgets,
    loading,
    error,
    submitting,
    filters,
    setFilters,
    addExpense,
    editExpense,
    removeExpense,
    updateBudget,
    clearBudget,
  } = useExpenses();

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditing] = useState(null);
  const [showBudgets, setShowBudgets] = useState(false);

  function openAddForm() {
    setEditing(null);
    setShowForm(true);
  }

  function openEditForm(expense) {
    setEditing(expense);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(null);
  }

  async function handleFormSubmit(payload) {
    const result = editingExpense
      ? await editExpense(editingExpense.id, payload)
      : await addExpense(payload);

    if (result.success) closeForm();
    return result;
  }

  function handleExportCSV() {
    const filename = `expenses_${filters.from || "all"}_to_${filters.to || "all"}.csv`;
    exportExpensesToCSV(expenses, filename);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-ink-100 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💼</span>
            <span className="font-display font-semibold text-ink-900">
              Pennywise
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBudgets(!showBudgets)}
              className={`btn-secondary text-xs hidden sm:flex items-center gap-1 ${showBudgets ? "bg-ink-100" : ""}`}
            >
              💰 Budgets
            </button>
            <button
              onClick={handleExportCSV}
              disabled={expenses.length === 0}
              className="btn-secondary text-xs hidden sm:flex items-center gap-1 disabled:opacity-40"
            >
              ⬇ Export CSV
            </button>
            <button
              onClick={openAddForm}
              className="btn-primary flex items-center gap-1"
            >
              <span className="text-base leading-none">+</span>
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Error banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <span className="text-base">⚠️</span>
            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <FilterBar filters={filters} setFilters={setFilters} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-2 sm:hidden">
              <button
                onClick={() => setShowBudgets(!showBudgets)}
                className="btn-secondary text-xs flex-1"
              >
                💰 Budgets
              </button>
              <button
                onClick={handleExportCSV}
                disabled={expenses.length === 0}
                className="btn-secondary text-xs flex-1 disabled:opacity-40"
              >
                ⬇ Export CSV
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-ink-800 text-lg">
                Transactions
              </h2>
              <span className="text-xs text-ink-400">
                {loading
                  ? "Loading…"
                  : `${expenses.length} record${expenses.length !== 1 ? "s" : ""}`}
              </span>
            </div>

            <ExpenseTable
              expenses={expenses}
              loading={loading}
              onEdit={openEditForm}
              onDelete={removeExpense}
            />
          </div>

          <div className="space-y-4">
            <SummaryPanel
              summary={summary}
              filters={filters}
              budgets={budgets}
            />
            <CategoryChart summary={summary} />
            {showBudgets && (
              <BudgetManager
                budgets={budgets}
                onSave={updateBudget}
                onRemove={clearBudget}
              />
            )}
          </div>
        </div>
      </main>

      {/* Add / Edit Modal */}
      {showForm && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={handleFormSubmit}
          onClose={closeForm}
          submitting={submitting}
        />
      )}
    </div>
  );
}
