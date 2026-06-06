import { CATEGORIES } from "../constants/categories";
import {
  thisMonthRange,
  lastMonthRange,
  last7DaysRange,
  todayString,
} from "../utils/dateHelpers";

const PRESETS = [
  { id: "thisMonth", label: "This Month" },
  { id: "lastMonth", label: "Last Month" },
  { id: "last7", label: "Last 7 Days" },
  { id: "all", label: "All Time" },
  { id: "custom", label: "Custom" },
];

export default function FilterBar({ filters, setFilters }) {
  function applyPreset(presetId) {
    let range = {};
    if (presetId === "thisMonth") range = thisMonthRange();
    else if (presetId === "lastMonth") range = lastMonthRange();
    else if (presetId === "last7") range = last7DaysRange();
    else if (presetId === "all") range = { from: "", to: "" };
    else range = { from: filters.from, to: filters.to }; 

    setFilters((prev) => ({
      ...prev,
      ...range,
      preset: presetId,
    }));
  }

  function handleCategory(e) {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  }

  function handleDateChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value, preset: "custom" }));
  }

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {/* Category filter */}
        <div className="flex-shrink-0">
          <label className="block text-xs font-medium text-ink-500 mb-1.5 uppercase tracking-wide">
            Category
          </label>
          <select
            value={filters.category}
            onChange={handleCategory}
            className="input-field w-36"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-ink-500 mb-1.5 uppercase tracking-wide">
            Period
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  filters.preset === p.id
                    ? "bg-ink-900 text-white"
                    : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5 uppercase tracking-wide">
              From
            </label>
            <input
              type="date"
              value={filters.from}
              max={filters.to || todayString()}
              onChange={(e) => handleDateChange("from", e.target.value)}
              className={`input-field w-36 text-xs ${filters.preset === "custom" ? "ring-2 ring-ink-900" : ""}`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1.5 uppercase tracking-wide">
              To
            </label>
            <input
              type="date"
              value={filters.to}
              min={filters.from}
              max={todayString()}
              onChange={(e) => handleDateChange("to", e.target.value)}
              className={`input-field w-36 text-xs ${filters.preset === "custom" ? "ring-2 ring-ink-900" : ""}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
