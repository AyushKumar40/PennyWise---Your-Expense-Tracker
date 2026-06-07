# PennyWise — Mini Expense Tracker

PennyWise is a full-stack personal finance web application built as part of a mini project evaluation. It allows users to log, categorise, and analyse their daily expenses through a clean dashboard interface. The app supports adding, editing, and deleting expenses with category tagging, date filtering, per-category budget tracking with visual progress bars, spending charts (pie and bar), and CSV export — all backed by a persistent SQLite database via `sql.js` and a RESTful Express API.


## Live Demo

- **Frontend (Netlify):** https://pennywiseee.netlify.app/
- **Backend (Render):** https://pennywise-your-expense-tracker.onrender.com/api/health


## Tech Stack

|Layer              | Technology        |  Why
 --------------------------------------------------------------------------------- 
| Frontend UI       | React 18          | Component model fits a dashboard with modals, filters, and live state

| Styling           | Tailwind CSS v3   | Utility-first CSS keeps styles co-located and avoids a separate stylesheet sprawl

| Charts            | Recharts          | Declarative chart components that integrate cleanly with React state               

| CSV Export        | PapaParse         | Battle-tested CSV library; handles edge cases like commas in notes               

| Build Tool        | Vite              | Fast HMR in development, simple production build output                                 

| Backend           | Node.js + Express | Minimal setup, easy routing, good ecosystem fit for a REST API                 

| Database          | sql.js (SQLite)   | File-based SQLite with no native binaries required — works on any platform            

| Runtime Config    | dotenv            | Standard approach to separating environment-specific config from code                




## Project Structure

``` 
expense-tracker/
│
├── client/                        # React + Vite frontend
│   ├── public/
│   │   └── _redirects             # Netlify SPA routing fix
│   └── src/
│       ├── api/
│       │   └── expenseApi.js      # All fetch calls to the backend
│       ├── components/
│       │   ├── ExpenseForm.jsx    # Add/edit modal with validation
│       │   ├── ExpenseTable.jsx   # Transactions list, desktop + mobile
│       │   ├── FilterBar.jsx      # Category + date range filters
│       │   ├── SummaryPanel.jsx   # Total, highest expense, category breakdown
│       │   ├── CategoryChart.jsx  # Recharts pie and bar charts
│       │   └── BudgetManager.jsx  # Per-category budget settings
│       ├── hooks/
│       │   └── useExpenses.js     # All state, data fetching, and CRUD logic
│       ├── utils/
│       │   ├── currency.js        # INR formatting with Intl.NumberFormat
│       │   ├── dateHelpers.js     # Date range calculators and formatters
│       │   └── csvExport.js       # PapaParse-powered CSV download
│       ├── constants/
│       │   └── categories.js      # Category list, colours, and icons
│       ├── App.jsx                # Root layout and modal orchestration
│       └── main.jsx               # ReactDOM entry point
│
├── server/                        # Node.js + Express backend
│   ├── data/                      # Auto-created; holds expenses.db
│   └── src/
│       ├── app.js                 # Express setup, CORS, middleware, server start
│       ├── routes/
│       │   └── expenseRoutes.js   # Route definitions
│       ├── controllers/
│       │   └── expenseController.js  # Request handlers
│       ├── models/
│       │   └── expenseModel.js    # All SQL queries via sql.js
│       ├── middleware/
│       │   └── validateExpenses.js   # Input validation middleware
│       └── db/
│           └── database.js        # SQLite init, persistence to disk
│
└── README.md
```

## How to Run Locally

These commands assume only Node.js (v18+) is installed. Clone the repo first.

### 1. Start the Backend

```bash
cd server
npm install
node src/app.js
```

The API will be available at `http://localhost:5000`. You should see:

```
Database initialised at: ./data/expenses.db
Server running on http://localhost:5000
```

### 2. Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

The app will open at `http://localhost:5173`. The Vite dev server proxies all `/api` requests to `localhost:5000` automatically — no extra config needed.

### Optional: Run the Database Test

```bash
cd server
node test.js
```

This creates, updates, and deletes a test expense and prints the results to confirm the database layer is working.

## API Documentation

Base URL: `http://localhost:5000/api` (local) or your Render URL (production)

All responses follow the shape:

```json
{ "success": true, "data": ... }
```

or on error:

```json
{ "success": false, "message": "...", "errors": [...] }
```

---

### Expenses

**GET /expenses**

Fetch all expenses. Supports optional query params: `category`, `from` (YYYY-MM-DD), `to` (YYYY-MM-DD).

```
GET /expenses?category=Food&from=2026-06-01&to=2026-06-30
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "amount": 250,
      "category": "Food",
      "date": "2026-06-05",
      "note": "Lunch",
      "created_at": "..."
    }
  ]
}
```

---

**GET /expenses/summary**

Returns total spent, highest expense, and per-category breakdown. Accepts same `from`/`to` query params.

Response:

```json
{
  "success": true,
  "data": {
    "grandTotal": 4500,
    "highestExpense": { "id": 3, "amount": 1200, "category": "Bills", ... },
    "byCategory": [
      { "category": "Food", "total": 1800, "count": 7 }
    ]
  }
}
```

---

**GET /expenses/:id**

Fetch a single expense by ID.

---

**POST /expenses**

Create a new expense.

Request body:

```json
{ "amount": 250, "category": "Food", "date": "2026-06-05", "note": "Lunch" }
```

Validation rules: amount must be positive, category must be one of the 7 valid categories, date cannot be in the future, note max 200 characters.

Response: `201` with the created expense object.

---

**PUT /expenses/:id**

Update an existing expense. Same request body and validation as POST.

---

**DELETE /expenses/:id**

Delete an expense by ID. Returns `{ "success": true, "message": "Expense deleted successfully." }`.

---

### Budgets

**GET /budgets**

Returns all saved category budgets.

```json
{ "success": true, "data": [{ "category": "Food", "amount": 5000 }] }
```

**PUT /budgets/:category**

Set or update a budget for a category.

Request body: `{ "amount": 5000 }`

**DELETE /budgets/:category**

Remove a budget for a category.

---

### Other

**GET /health** — Health check. Returns `{ "success": true, "message": "Expense Tracker API is running." }`.

**GET /categories** — Returns the list of valid expense categories.


## Next Steps

**What was intentionally left out for scope:**

- User authentication — currently the app is single-user with no login. Adding JWT-based auth would make it multi-tenant.

**What would be built next:**

- Add monthly trend charts — a line chart showing spending over time across months would provide better financial insight than the current single-period view.
- Push notifications or email summaries when a category exceeds its budget.
- A mobile app wrapper using React Native with the same backend API.



## What You Are Looking For

**Honesty in the README about what works, what does not, and what you would improve
with more time**

1. All features and functionalities are working as expected.
2. Yes, I used ChatGPT where appropriate, particularly for assistance with API design, resolving CORS-related issues, drafting portions of the README documentation, and refining parts of the project structure that I was unable to complete independently.
3. Given additional time, I would further enhance and optimize the backend implementation to improve its scalability, maintainability, and overall performance.