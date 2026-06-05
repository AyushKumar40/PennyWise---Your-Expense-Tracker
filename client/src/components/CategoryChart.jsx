import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { CATEGORY_COLORS } from "../constants/categories";
import { formatCurrency, formatCurrencyCompact } from "../utils/currency";

export default function CategoryChart({ summary }) {
  const [chartType, setChartType] = useState("pie");

  if (!summary || summary.byCategory || summary.byCategory.length === 0) {
    return (
      <div className="card p-6 text-center text-ink-400">
        <p className="text-2xl mb-2">📊</p>
        <p className="text-sm">No data to chart for this period.</p>
      </div>
    );
  }

  const data = summary.byCategory.map((item) => ({
    name: item.category,
    value: item.total,
    color: CATEGORY_COLORS[item.category] || "#94a3b8",
  }));

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-ink-500 uppercase tracking-wide">
          Spending by Category
        </p>
        <div className="flex gap-1 bg-ink-100 rounded-lg p-0.5">
          {["pie", "bar"].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                chartType === type
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              {type === "pie" ? "🥧 Pie" : "📊 Bar"}
            </button>
          ))}
        </div>
      </div>

      {chartType === "pie" ? <PieView data={data} /> : <BarView data={data} />}
    </div>
  );
}

function PieView({ data }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(value)}
          contentStyle={{
            fontSize: "12px",
            borderRadius: "8px",
            border: "1px solid #e5ddd1",
          }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ fontSize: "12px" }}>{value}</span>
          )}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function BarView({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ece4" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#96856b" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={formatCurrencyCompact}
          tick={{ fontSize: 10, fill: "#96856b" }}
          axisLine={false}
          tickLine={false}
          width={60}
        />
        <Tooltip
          formatter={(value) => [formatCurrency(value), "Spent"]}
          contentStyle={{
            fontSize: "12px",
            borderRadius: "8px",
            border: "1px solid #e5ddd1",
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
