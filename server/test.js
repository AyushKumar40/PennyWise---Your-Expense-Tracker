// Chatgpt-ed

require("dotenv").config();
const { initDatabase } = require("./src/db/database");
const model = require("./src/models/expenseModel");

initDatabase().then(() => {
  // Test create
  const e1 = model.createExpense({
    amount: 250,
    category: "Food",
    date: "2026-06-01",
    note: "Lunch",
  });
  console.log("Created:", e1);

  // Test getAll
  const all = model.getAllExpenses({});
  console.log("All expenses:", all);

  // Test update
  const updated = model.updateExpense(e1.id, {
    amount: 300,
    category: "Food",
    date: "2026-06-01",
    note: "Lunch updated",
  });
  console.log("Updated:", updated);

  // Test summary
  const summary = model.getSummary("2026-06-01", "2026-06-30");
  console.log("Summary:", summary);

  // Test delete
  model.deleteExpense(e1.id);
  console.log("After delete:", model.getAllExpenses({}).length, "records");

  process.exit(0);
});
