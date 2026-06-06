# PennyWise — Mini Expense Tracker

A full-stack expense tracking app built with **React + Tailwind CSS** (frontend) and **Node.js + Express + SQLite** (backend).

---

## Features

**Core (must-have)**

- Add, edit, and delete expenses with amount, category, date, and optional note
- View all expenses sorted by date (newest first)
- Filter by category and date range (This Month / Last Month / Last 7 Days / All Time / Custom)
- Summary panel: total spent, per-category breakdown, highest single expense

**Should-have**

- Pie and bar chart via Recharts
- Indian Rupee formatting (`₹1,234.50`) using `Intl.NumberFormat`
- Full form validation: no negative amounts, no future dates, category required

**Bonus / Polish**

- Export visible expenses as CSV
- Per-category budget setting with visual progress bar (turns red when over budget)
- SQLite persistence via `sql.js` (no native binaries required)
- Responsive layout — works on mobile and desktop
- Loading states and error banners

A small test.js is added to test the database actions, wether the data is created deleted etc. How do i wrote this? I didn't. I took asked this code from Chatgpt.

Backend is completed.
Jumping to frontend and making the components.

## Project Structure

```
expense-tracker/
├── server/                   # Node.js + Express API
│   ├── src/
│   │   ├── app.js             # Entry point, Express setup
│   │   ├── controllers/
│   │   │   └── expenseController.js   # Request handlers
│   │   ├── routes/
│   │   │   └── expenseRoutes.js       # Route definitions
│   │   ├── models/
│   │   │   └── expenseModel.js        # All SQL queries
│   │   ├── middleware/
│   │   │   └── validateExpense.js     # Input validation
│   │   └── db/
│   │       └── database.js            # SQLite init + persistence
│   ├── data/                  # Auto-created; holds expenses.db
│   └── .env
│
├── client/                  # React + Vite + Tailwind
│   ├── src/
│   │   ├── api/
│   │   │   └── expenseApi.js          # All API calls
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx        # Add / edit modal
│   │   │   ├── ExpenseTable.jsx       # Transactions list
│   │   │   ├── FilterBar.jsx          # Category + date filters
│   │   │   ├── SummaryPanel.jsx       # Totals + per-category
│   │   │   ├── CategoryChart.jsx      # Recharts pie & bar
│   │   │   └── BudgetManager.jsx      # Budget settings
│   │   ├── hooks/
│   │   │   └── useExpenses.js         # State + data fetching
│   │   ├── utils/
│   │   │   ├── currency.js            # ₹ formatting
│   │   │   ├── dateHelpers.js         # Date range helpers
│   │   │   └── csvExport.js           # CSV download
│   │   ├── constants/
│   │   │   └── categories.js          # Category list + colors
│   │   ├── App.jsx                    # Root component
│   │   └── main.jsx                   # ReactDOM entry
│   └── ...config files
│
└── README.md