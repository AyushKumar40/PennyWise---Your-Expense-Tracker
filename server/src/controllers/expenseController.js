const model = require("../models/expenseModel");

// api/expenses
function getExpenses(req, res) {
  try {
    const { category, from, to } = req.query;
    const expenses = model.getAllExpenses({ category, from, to });
    res.json({ success: true, data: expenses });
  } catch (err) {
    console.error("getExpenses error", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch expenses." });
  }
}

// api/summary
function getSummary(req, res) {
  try {
    let { from, to } = req.query;

    if (!from && !to) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      from = `${year}-${month}-01`;
      const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
      to = `${year}-${month}-${lastDay}`;
    }
    const summary = model.getSummary(from, to);
    res.json({ success: true, data: summary });
  } catch (err) {
    console.error("getSummary error", err);
    res
      .status(500)
      .json({ success: false, message: " Failed to fetch summary." });
  }
}

// api/:id
function getExpenseById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid expense ID." });
    }
    const expense = model.getExpenseById(id);
    if (!expense) {
      return res
        .status(404)
        .json({ success: false, message: "Expenses not found." });
    }
    res.json({ success: true, data: expense });
  } catch (err) {
    console.error("getExpenseById error", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch expense." });
  }
}

// api/expenses
function createExpense(req, res) {
  try {
    const { amount, category, date, note } = req.body;
    const expense = model.createExpense({ amount, category, date, note });
    res.status(201).json({
      success: true,
      data: expense,
      message: "Expense added successfully.",
    });
  } catch (err) {
    console.error("createExpense error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create expense." });
  }
}

// PUT api/:id
function updateExpense(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, messgae: "Invalid expense ID" });
    }

    const existing = model.getExpenseById(id);
    if (!existing) {
      return res
        .status(500)
        .json({ success: false, message: "Expense not found" });
    }

    const { amount, category, date, note } = req.body;
    const updated = model.updateExpense(id, { amount, category, date, note });
    res.json({
      success: true,
      data: updated,
      message: "Expense updated successfully",
    });
  } catch (err) {
    console.error("updateExpense error", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update expense." });
  }
}

// DELETE expense/:id
function deleteExpense(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid expense ID" });
    }

    const existing = model.getExpenseById(id);
    if (!existing) {
      return res
        .status(400)
        .json({ success: false, message: "Expense not found" });
    }
    model.deleteExpense(id);
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    console.error("deleteExpense error", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete expense" });
  }
}

// api/budgets
function getBudgets(req, res) {
  try {
    const budgets = model.getAllBudgets();
    res.json({ success: true, data: budgets });
  } catch (err) {
    console.error("getBudgets error", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch budgets" });
  }
}

// api/budgets/:category
function upsertBudget(req, res) {
  try {
    const { category } = req.params;
    const { amount } = req.body;
    const budget = model.upsertBudget(category, amount);
    res.json({ success: true, data: budget, message: "Budget saved" });
  } catch (err) {
    console.error("upsertBufget error", err);
    res.status(500).json({ success: false, message: "Failed to save budget" });
  }
}

// DELETE api/budgets/:category
function deleteBudget(req, res) {
  try {
    const { category } = req.params;
    model.deleteBudget(category);
    res.json({ success: true, message: "Budget removed" });
  } catch (err) {
    console.error("deleteBudget error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to remove budget" });
  }
}

function getCategories(req, res) {
  res.json({ success: true, data: model.VALID_CATEGORIES });
}

module.exports = {
  getExpenses,
  getSummary,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getBudgets,
  upsertBudget,
  deleteBudget,
  getCategories,
};
