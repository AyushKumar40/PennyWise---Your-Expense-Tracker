import Papa from "papaparse";
import { formatDate } from "./dateHelpers";

export function exportExpensesToCSV(expenses, filename = "expenses.csv") {
  if (!expenses || expenses.length === 0) return;

  const rows = expenses.map((e) => ({
    ID: e.id,
    Date: formatDate(e.date),
    Category: e.category,
    Amount: e.amount.toFixed(2),
    Note: e.note || "",
  }));

  const csv = Papa.unparse(rows, { header: true });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
