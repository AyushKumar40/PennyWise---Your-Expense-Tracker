import { useState } from "react";
import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/dateHelpers";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../constants/categories";

export default function ExpenseTable({ expenses, onEdit, onDelete, loading }) {
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  async function handleDelete(id) {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
    setConfirmId(null);
  }

  if (loading) {
    return (
      <div className="card p-8">
        <div className="flex flex-col items-center gap-3 text-ink-400">
          <div className="w-8 h-8 border-2 border-ink-200 border-t-ink-600 rounded-full animate-spin" />
          <p className="text-sm">Loading expenses…</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="card p-10 text-center fade-in">
        <p className="text-4xl mb-3">🗒️</p>
        <p className="font-semibold text-ink-700">No expenses found</p>
        <p className="text-sm text-ink-400 mt-1">
          Add your first expense or adjust the filters.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden fade-in">
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">
                Date
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">
                Category
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">
                Note
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">
                Amount
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, i) => (
              <tr
                key={expense.id}
                className={`border-b border-ink-50 hover:bg-ink-50 transition-colors ${
                  i === expenses.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-3 text-ink-600 font-mono text-xs whitespace-nowrap">
                  {formatDate(expense.date)}
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={expense.category} />
                </td>
                <td className="px-4 py-3 text-ink-500 max-w-[200px] truncate">
                  {expense.note || (
                    <span className="text-ink-300 italic">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold font-mono text-ink-900 whitespace-nowrap">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 justify-end">
                    {confirmId === expense.id ? (
                      <>
                        <span className="text-xs text-ink-500 mr-1">
                          Delete?
                        </span>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          disabled={deletingId === expense.id}
                          className="text-xs px-2 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors disabled:opacity-50"
                        >
                          {deletingId === expense.id ? "…" : "Yes"}
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="text-xs px-2 py-1 bg-ink-100 text-ink-700 rounded hover:bg-ink-200 transition-colors"
                        >
                          No
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(expense)}
                          className="p-1.5 text-ink-400 hover:text-ink-700 hover:bg-ink-100 rounded-lg transition-colors"
                          aria-label="Edit expense"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          onClick={() => setConfirmId(expense.id)}
                          className="p-1.5 text-ink-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          aria-label="Delete expense"
                        >
                          <TrashIcon />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden divide-y divide-ink-100">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <CategoryBadge category={expense.category} />
                  <span className="text-xs text-ink-400 font-mono">
                    {formatDate(expense.date)}
                  </span>
                </div>
                {expense.note && (
                  <p className="text-sm text-ink-500 truncate">
                    {expense.note}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold font-mono text-ink-900">
                  {formatCurrency(expense.amount)}
                </p>
                <div className="flex gap-1 mt-1 justify-end">
                  {confirmId === expense.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        disabled={deletingId === expense.id}
                        className="text-xs px-2 py-1 bg-rose-500 text-white rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-xs px-2 py-1 bg-ink-100 text-ink-700 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-1.5 text-ink-400 hover:text-ink-700 hover:bg-ink-100 rounded-lg"
                      >
                        <PencilIcon />
                      </button>
                      <button
                        onClick={() => setConfirmId(expense.id)}
                        className="p-1.5 text-ink-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <TrashIcon />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-ink-100 px-4 py-2 bg-ink-50 text-xs text-ink-400 text-right">
        {expenses.length} {expenses.length === 1 ? "record" : "records"}
      </div>
    </div>
  );
}

function CategoryBadge({ category }) {
  const color = CATEGORY_COLORS[category] || "#94a3b8";
  const icon = CATEGORY_ICONS[category] || "📦";
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      <span>{icon}</span>
      {category}
    </span>
  );
}

function PencilIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  );
}
