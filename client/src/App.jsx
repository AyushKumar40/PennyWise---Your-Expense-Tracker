import { useState } from "react";
import { useExpenses } from "./hooks/useExpenses";
import CategoryChart from "./components/CategoryChart";
import BudgetManager from "./components/BudgetManager";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseTable from "./components/ExpenseTable";
import FilterBar from "./components/FilterBar";
import SummaryPanel from "./components/SummaryPanel";

export default function App() {
  const { error } = useExpenses();
  const [showBudgets, setShowBudgets] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-ink-100 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💼</span>
            <span className="font-display font-semibold text-ink-900">
              PennyWise
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBudgets(!showBudgets)}
              className={`btn-secondary text-xs hidden sm:flex items-center gap-1 ${showBudgets ? "bg-ink-100" : ""}`}
            >
              Budgets
            </button>
            <button className="btn-secondary text-xs hidden sm:flex items-center gap-1 disabled:opacity-40">
              Export CSV
            </button>
            <button className="btn-primary flex items-center gap-1">
              <span className="text-base leading-none">+</span>
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Error Banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
            <span className="text-base"></span>
            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <FilterBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-2 sm:hidden">
              <button className="btn-secondary text-xs flex-1">Budgets</button>
              <button className="btn-secondary text-xs flex-1 disabled:opacity-40">
                Export CSV
              </button>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-ink-800 text-lg">
                Transactions
              </h2>
              <span></span>
            </div>

            <ExpenseTable />
          </div>

          <div className="space-y-4">
            <SummaryPanel />
            <CategoryChart />
            {<BudgetManager />}
          </div>
        </div>
      </main>

      {/* Add / Edit Modal */}
      {<ExpenseForm />}
    </div>
  );
}
