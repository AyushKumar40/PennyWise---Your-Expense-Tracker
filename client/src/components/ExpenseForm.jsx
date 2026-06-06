import { useState, useEffect } from "react";
import { CATEGORIES } from "../constants/categories";
import { todayString } from "../utils/dateHelpers";

const EMPTY_FORM = {
  amount: "",
  category: "",
  date: todayString(),
  note: "",
};

export default function ExpenseForm({
  expense,
  onSubmit,
  onClose,
  submitting,
}) {
  const isEditing = Boolean(expense);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const t = setTimeout(() => {
      if (expense) {
        setForm({
          amount: String(expense.amount),
          category: expense.category,
          date: expense.date,
          note: expense.note || "",
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setErrors({});
    }, 0);

    return () => clearTimeout(t);
  }, [expense]);

  function validate() {
    const newErrors = {};

    const parsedAmount = parseFloat(form.amount);
    if (!form.account || isNaN(parsedAmount)) {
      newErrors.amount = "Amount is required";
    } else if (parsedAmount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!form.category) {
      newErrors.category = "Please select a category";
    }

    if (!form.date) {
      newErrors.date = "Date is required";
    } else if (form.date > todayString()) {
      newErrors.date = "Date cannot be in the future";
    }

    if (form.note.length > 200) {
      newErrors.note = "Note must be under 200 characters.";
    }
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await onSubmit({
      amount: parseFloat(form.amount),
      category: form.category,
      date: form.date,
      note: form.note.trim(),
    });
    if (result?.success === false) {
      setErrors({ _general: result.message });
    }
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, _general: undefined }));
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="card w-full max-w-md modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-ink-100">
          <h2 className="text-lg font-semibold text-ink-900">
            {isEditing ? "Edit Expense" : "Add Expense"}
          </h2>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-ink-700 transition-colors p-1 rounded-lg hover:bg-ink-100"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-5 space-y-4">
            {/* General error */}
            {errors._general && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-3 py-2 rounded-lg text-sm">
                {errors._general}
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="e.g. 250.00"
                value={form.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                className={`input-field ${errors.amount ? "border-rose-400 focus:ring-rose-400" : ""}`}
                autoFocus
              />
              {errors.amount && (
                <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={`input-field ${errors.category ? "border-rose-400 focus:ring-rose-400" : ""}`}
              >
                <option value="">Select a category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-rose-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                max={todayString()}
                onChange={(e) => handleChange("date", e.target.value)}
                className={`input-field ${errors.date ? "border-rose-400 focus:ring-rose-400" : ""}`}
              />
              {errors.date && (
                <p className="text-rose-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Note{" "}
                <span className="text-ink-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                maxLength={200}
                placeholder="e.g. Lunch with team"
                value={form.note}
                onChange={(e) => handleChange("note", e.target.value)}
                className={`input-field ${errors.note ? "border-rose-400 focus:ring-rose-400" : ""}`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.note ? (
                  <p className="text-rose-500 text-xs">{errors.note}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-ink-400">
                  {form.note.length}/200
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end px-5 pb-5">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary min-w-[100px]"
            >
              {submitting
                ? isEditing
                  ? "Saving…"
                  : "Adding…"
                : isEditing
                  ? "Save Changes"
                  : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
