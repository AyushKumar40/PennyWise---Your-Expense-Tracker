import { useState, useEffect, useCallback } from "react";
import * as api from "../api/expenseApi";
import { thisMonthRange } from "../utils/dateHelpers";

export function useExpenses() {
  const defaultRange = thisMonthRange();

  const [filters, setFilters] = useState({
    category: "All",
    from: defaultRange.from,
    to: defaultRange.to,
    preset: "thisMonth",
  });

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgets, setBudgets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch expenses and summary together whenever filters change
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        api.fetchExpenses(filters),
        api.fetchSummary(filters.from, filters.to),
      ]);
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError(err.message || "Failed to load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadBudgets = useCallback(async () => {
    try {
      const res = await api.fetchBudgets();
      setBudgets(res.data);
    } catch {
      //
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadBudgets();
  }, [loadBudgets]);

  async function addExpense(payload) {
    setSubmitting(true);
    try {
      await api.createExpense(payload);
      await loadData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setSubmitting(false);
    }
  }

  async function editExpense(id, payload) {
    setSubmitting(true);
    try {
      await api.updateExpense(id, payload);
      await loadData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setSubmitting(false);
    }
  }

  async function removeExpense(id) {
    try {
      await api.deleteExpense(id);
      await loadData();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async function updateBudget(category, amount) {
    try {
      await api.saveBudget(category, amount);
      await loadBudgets();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async function clearBudget(category) {
    try {
      await api.removeBudget(category);
      await loadBudgets();
    } catch {
      //
    }
  }

  function getBudgetForCategory(category) {
    return budgets.find((b) => b.category === category)?.amount || null;
  }

  return {
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
    getBudgetForCategory,
    reload: loadData,
  };
}
