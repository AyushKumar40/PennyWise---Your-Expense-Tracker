const express = require("express");
const router = express.Router();
const controller = require("../controllers/expenseController");
const {
  validateExpense,
  validateBudget,
} = require("../middleware/validateExpenses");

// Expense routes
router.get("/expenses/summary", controller.getSummary);
router.get("/expenses", controller.getExpenses);
router.get("/expenses/:id", controller.getExpenseById);
router.post("/expenses", validateExpense, controller.createExpense);
router.put("/expenses/:id", validateExpense, controller.updateExpense);
router.delete("/expenses/:id", controller.deleteExpense);

// Category routes
router.get("/categories", controller.getCategories);

// Budget routes
router.get("/budgets", controller.getBudgets);
router.put("/budgets/:category", validateBudget, controller.upsertBudget);
router.delete("/budgets/:category", controller.deleteBudget);

module.exports = router;
