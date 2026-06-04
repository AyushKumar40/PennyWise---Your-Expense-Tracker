const { getDb, saveToDisk } = require("../db/database");

const VALID_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Entertainment",
  "Health",
  "Shopping",
  "Others",
];

function toObjects(stmt) {
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

function getAllExpenses(filters = {}) {
  const db = getDb();
  const { category, from, to } = filters;

  const conditions = [];
  const params = {};

  if (category && category !== "All") {
    conditions.push("category = :category");
    params[":category"] = category;
  }
  if (from) {
    conditions.push("date >= :from");
    params[":from"] = from;
  }
  if (to) {
    conditions.push("date <= :to");
    params[":to"] = to;
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join("AND")}` : "";
  const stmt = db.prepare(
    `Select * FROM expenses ${where} ORDER BY date DESC,
    created_at DESC`,
  );
  stmt.bind(params);
  return toObjects(stmt);
}

function getExpenseById(id) {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM expenses WHERE id = :id");
  stmt.bind({ ":id": id });
  const results = toObjects(stmt);
  return results[0] || null;
}

function createExpense({ amount, category, date, note }) {
  const db = getDb();
  db.run(
    "INSERT INTO expenses (amount, category, date, note) VALUES  (:amount, :category, :date, :note)",
    {
      ":amount": amount,
      ":category": category,
      ":date": date,
      ":note": note || "",
    },
  );

  const stmt = db.prepare(
    "SELECT * FROM expenses WHERE id = last_insert_rowid()",
  );
  const result = toObjects(stmt);
  saveToDisk();
  return result[0];
}

function updateExpense(id, { amount, category, date, note }) {
  const db = getDb();
  db.run(
    `UPDATE expenses 
        SET amount = :amount, category = :category, date =:date,
        note = :note
        WHERE id = :id`,
    {
      ":amount": amount,
      ":category": category,
      ":date": date,
      ":note": note || "",
      ":id": id,
    },
  );
  saveToDisk();
  return getExpenseById(id);
}

function deleteExpense(id) {
  const db = getDb();
  db.run("DELETE FROM expenses WHERE id = :id", { ":id": id });
  saveToDisk();
}

function getSummary(from, to) {
  const db = getDb();

  const conditions = [];
  const params = {};
  if (from) {
    conditions.push("date >= :from");
    params[":from"] = from;
  }
  if (to) {
    conditions.push("date <= :to");
    params[":to"] = to;
  }
  const where = conditions.length ? `WHERE ${conditions.join("AND")}` : "";

  const categoryStmt = db.prepare(
    `SELECT category, SUM(amount) as total, COUNT(*) as count FROM expenses ${where}
    GROUP BY category
    ORDER BY total DESC`,
  );
  categoryStmt.bind(params);
  const byCategory = toObjects(categoryStmt);

  const totalStmt = db.prepare(
    `SELECT SUM(amount) as grandTotal, MAX(amount) as highestExpense FROM expenses ${where}`,
  );
  totalStmt.bind(params);
  const totals = toObjects(totalStmt)[0] || {
    grandTotal: 0,
    highestExpense: 0,
  };

  const highestStmt = db.prepare(
    `SELECT * FROM expenses ${where} ORDER BY amount DESC LIMIT 1`,
  );
  highestStmt.bind(params);
  const highestExpense = toObjects(highestStmt)[0] || null;

  return {
    grandTotal: totals.grandTotal || 0,
    highestExpenseAmount: totals.highestExpense || 0,
    highestExpense,
    byCategory,
  };
}

function getAllBudgets() {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM budgets");
  return toObjects(stmt);
}

function upsertBudget(category, amount) {
  const db = getDb();
  db.run(
    "INSERT INTO budgets (category, amount) VALUES (:category, :amount) ON CONFLICT(category) DO UPDATE SET amount = :amount",
    { ":category": category, ":amount": amount },
  );
  saveToDisk();
  const stmt = db.prepare("SELECT * FROM budgets WHERE category = :category");
  stmt.bind({ ":category": category });
  return toObjects(stmt)[0];
}

function deleteBudget(category) {
  const db = getDb();
  db.run("DELETE FROM budgets WHERE category = :category", {
    ":category": category,
  });
  saveToDisk();
}

module.exports = {
  VALID_CATEGORIES,
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getSummary,
  getAllBudgets,
  upsertBudget,
  deleteBudget,
};
