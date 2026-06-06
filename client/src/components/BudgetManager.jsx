import { useState } from "react";
import { CATEGORIES, CATEGORY_ICONS } from "../constants/categories";
import { formatCurrency } from "../utils/currency";

export default function BudgetManager({ budgets, onSave, onRemove }) {
  const [editing, setEditing] = useState(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const budgetMap = {};
  budgets?.forEach((b) => {
    budgetMap[b.category] = b.amount;
  });

  function startEdit(category) {
    setEditing(category);
    setValue(budgetMap[category] ? String(budgetMap[category]) : "");
    setError("");
  }

  async function handleSave(category) {
    const parsed = parseFloat(value);
    if (!value || isNaN(parsed) || parsed <= 0) {
      setError("Enter a positive amount");
      return;
    }
    const result = await onSave(category, parsed);
    if (result.success) {
      setEditing(null);
      setValue("");
      setError("");
    } else {
      setError(result.message);
    }
  }

  function handleCancel() {
    setEditing(null);
    setValue("");
    setError("");
  }

  return (
    <div className="card p-4">
      <p className="text-xs font-medium text-ink-500 uppercase tracking-wide mb-3">
        Monthly Budgets
      </p>
      <div className="space-y-2">
        {CATEGORIES.map((category) => {
          const budget = budgetMap[category];
          const icon = CATEGORY_ICONS[category] || "📦";
          const isEditing = editing === category;

          return (
            <div key={category} className="flex items-center gap-2">
              <span className="text-sm w-5">{icon}</span>
              <span className="text-sm text-ink-700 flex-1 min-w-0">
                {category}
              </span>

              {isEditing ? (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-xs text-ink-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={value}
                    onChange={(e) => {
                      if (e.key === "Enter") handleSave(category);
                      if (e.key === "Escape") handleCancel();
                    }}
                    className="input-field w-24 text-xs py-1px2
                    "
                    autoFocus
                    placeholder="e.g. 5000"
                  />
                  <button
                    onClick={() => handleSave(category)}
                    className="text-xs px-2 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-xs px-2 py-1 bg-ink-100 text-ink-700 rounded-lg hover:bg-ink-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {budget ? (
                    <>
                      <span className="text-xs font-mono text-ink-600">
                        {formatCurrency}
                      </span>
                      <button
                        onClick={() => startEdit(category)}
                        className="text-xs text-ink-400 hover:text-ink-700 transition-colors"
                        aria-label={`Edit ${category} budget`}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onRemove(category)}
                        className=""
                        aria-label={`Remove ${category} budget`}
                      >
                        ✕
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(category)}
                      className="text-xs text-ink-400 hover:text-ink-700 transition-colors"
                    >
                      + Set budget
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {error && <p className="text-rose-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
