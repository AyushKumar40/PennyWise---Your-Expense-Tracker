import { formatCurrency } from "../utils/currency";
import { formatDate, monthYearLabel } from "../utils/dateHelpers";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../constants/categories";

export default function SummaryPanel({ summary, filters, budgets }) {
  if (!summary) return null;

  const { grandTotal, highestExpense, byCategory } = summary;

  // Build budget map for quick lookup
  const budgetMap = {};
  budgets?.forEach((b) => {
    budgetMap[b.category] = b.amount;
  });

  const periodLabel =
    filters.from && filters.to
      ? `${formatDate(filters.from)} – ${formatDate(filters.to)}`
      : "All Time";

  return (
    <div className="space-y-4">
      {/* Grand total card */}
      <div className="card p-5 bg-ink-900 text-white">
        <p className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-1">
          Total Spent
        </p>
        <p className="text-3xl font-display font-bold">
          {formatCurrency(grandTotal)}
        </p>
        <p className="text-xs text-ink-400 mt-1">{periodLabel}</p>
      </div>

      {/* Highest expense */}
      {highestExpense && (
        <div className="card p-4">
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wide mb-2">
            💸 Highest Expense
          </p>
          <p className="font-semibold font-mono text-ink-900 text-lg">
            {formatCurrency(highestExpense.amount)}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <CategoryChip category={highestExpense.category} />
            <span className="text-xs text-ink-400">
              · {formatDate(highestExpense.date)}
            </span>
          </div>
          {highestExpense.note && (
            <p className="text-xs text-ink-400 mt-1 truncate">
              {highestExpense.note}
            </p>
          )}
        </div>
      )}

      {/* Per-category breakdown */}
      {byCategory.length > 0 && (
        <div className="card p-4">
          <p className="text-xs font-medium text-ink-500 uppercase tracking-wide mb-3">
            By Category
          </p>
          <div className="space-y-3">
            {byCategory.map(({ category, total, count }) => {
              const budget = budgetMap[category];
              const pct = budget ? Math.min((total / budget) * 100, 100) : null;
              const over = budget && total > budget;
              const color = CATEGORY_COLORS[category] || "#94a3b8";
              const icon = CATEGORY_ICONS[category] || "📦";

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{icon}</span>
                      <span className="text-sm font-medium text-ink-700">
                        {category}
                      </span>
                      <span className="text-xs text-ink-400">({count})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm font-semibold text-ink-900">
                        {formatCurrency(total)}
                      </span>
                      {budget && (
                        <span
                          className={`text-xs ml-1 ${over ? "text-rose-500 font-medium pulse-soft" : "text-ink-400"}`}
                        >
                          / {formatCurrency(budget)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Budget progress bar */}
                  {pct !== null && (
                    <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: over ? "#f43f5e" : color,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryChip({ category }) {
  const color = CATEGORY_COLORS[category] || "#94a3b8";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {category}
    </span>
  );
}
