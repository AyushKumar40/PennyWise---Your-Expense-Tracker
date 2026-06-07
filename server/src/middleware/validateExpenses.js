const { VALID_CATEGORIES } = require("../models/expenseModel");

function validateExpense(req, res, next) {
  const { amount, category, date, note } = req.body;
  const errors = [];

  // Amount validation
  if (amount === undefined || amount === null || amount === "") {
    errors.push("Amount is required.");
  } else {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      errors.push("Amount must be a positive number.");
    }
  }

  // Category validation
  if (!category || category.trim() === "") {
    errors.push("Category is required.");
  } else if (!VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(", ")}.`);
  }

  // Date validation
  if (!date || date.trim() === "") {
    errors.push("Date is required.");
  } else {
    const expenseDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); 

    if (isNaN(expenseDate.getTime())) {
      errors.push("Date must be a valid date.");
    } else if (expenseDate > today) {
      errors.push("Date cannot be in the future.");
    }
  }

  // Note validation 
  if (note && note.length > 200) {
    errors.push("Note must be 200 characters or fewer.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  req.body.amount = parseFloat(amount);
  req.body.category = category.trim();
  req.body.date = date.trim();
  req.body.note = (note || "").trim();

  next();
}

function validateBudget(req, res, next) {
  const { amount } = req.body;
  const { category } = req.params;
  const { VALID_CATEGORIES } = require("../models/expenseModel");

  const errors = [];

  if (!VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(", ")}.`);
  }

  const parsed = parseFloat(amount);
  if (isNaN(parsed) || parsed <= 0) {
    errors.push("Budget amount must be a positive number.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  req.body.amount = parsed;
  next();
}

module.exports = { validateExpense, validateBudget };
