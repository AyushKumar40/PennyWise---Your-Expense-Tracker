const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    const message =
      data.errors?.join(", ") || data.message || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// Expenses
export async function fetchExpenses(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "All")
    params.set("category", filters.category);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  const query = params.toString() ? `?${params}` : "";
  return request(`/expenses${query}`);
}

export async function fetchSummary(from, to) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const query = params.toString() ? `?${params}` : "";
  return request(`/expenses/summary${query}`);
}

export async function createExpense(payload) {
  return request("/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateExpense(id, payload) {
  return request(`/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteExpense(id) {
  return request(`/expenses/${id}`, { method: "DELETE" });
}

// Budgets
export async function fetchBudgets() {
  return request("/budgets");
}

export async function saveBudget(category, amount) {
  return request(`/budgets/${category}`, {
    method: "PUT",
    body: JSON.stringify({ amount }),
  });
}

export async function removeBudget(category) {
  return request(`/budgets/${category}`, { method: "DELETE" });
}
