const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.resolve(process.env.DB_PATH || "./data/expenses.db");

let db = null;

function saveToDisk() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, buffer);
}

async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      amount      REAL    NOT NULL,
      category    TEXT    NOT NULL,
      date        TEXT    NOT NULL,
      note        TEXT    DEFAULT '',
      created_at  TEXT    DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS budgets (
      category  TEXT  PRIMARY KEY,
      amount    REAL  NOT NULL
    )
  `);

  saveToDisk();
  console.log("Database initialised at:", DB_PATH);
  return db;
}

function getDb() {
  if (!db)
    throw new Error("Database not initialised. Call initDatabase() first.");
  return db;
}

module.exports = { initDatabase, getDb, saveToDisk };
