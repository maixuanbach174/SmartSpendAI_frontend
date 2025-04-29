"use client";

import React, { useEffect, useState, useMemo } from "react";
import TransactionItem from "./TransactionItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Transaction, TransactionType } from "../../data/transactions";
import { useTransactionDate } from "./TransactionDateContext";

// Utility: random integer
type Category = { name: string; icon: string };
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const expenseCategories: Category[] = [
  { name: "Groceries", icon: "🥦" },
  { name: "Dining", icon: "🍽️" },
  { name: "Transport", icon: "🚕" },
  { name: "Utilities", icon: "🔌" },
  { name: "Shopping", icon: "🛍️" },
];
const revenueCategories: Category[] = [
  { name: "Salary", icon: "💰" },
  { name: "Stocks", icon: "📈" },
  { name: "Crypto", icon: "🪙" },
  { name: "Dividends", icon: "💵" },
];

function generateByType(date: Date, type: TransactionType): Transaction[] {
  const pool = type === "expense" ? expenseCategories : revenueCategories;
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const count = randomInt(3, 7);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  return Array.from({ length: count }).map((_, idx) => {
    const cat = shuffled[idx % shuffled.length];
    const day = randomInt(1, days);
    const amt = parseFloat(
      ((Math.random() * (type === "expense" ? 200 : 3000)) +
        (type === "expense" ? 5 : 1000)).toFixed(2)
    );
    const txDate = new Date(year, month, day).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return {
      id: year * 100000 + month * 1000 + day * 10 + idx,
      name: `${cat.name} ${type === "expense" ? "Purchase" : "Income"}`,
      category: cat.name,
      icon: cat.icon,
      type,
      amount: amt,
      date: txDate,
      source: "Auto-Generated",
    };
  });
}

const filters: { label: string; value: TransactionType }[] = [
  { label: "All", value: "all" },
  { label: "Revenue", value: "revenue" },
  { label: "Expenses", value: "expense" },
];

const DynamicTransactionList: React.FC = () => {
  const { selectedDate, setSelectedDate } = useTransactionDate();
  const [filter, setFilter] = useState<TransactionType>("all");
  const [items, setItems] = useState<Transaction[]>([]);

  const expenseItems = useMemo(
    () => generateByType(selectedDate, "expense"),
    [selectedDate]
  );
  const revenueItems = useMemo(
    () => generateByType(selectedDate, "revenue"),
    [selectedDate]
  );

  useEffect(() => {
    let data: Transaction[] = [];
    if (filter === "all" || filter === "expense") data = data.concat(expenseItems);
    if (filter === "all" || filter === "revenue") data = data.concat(revenueItems);
    if (filter === "all" && data.length > 7) data = data.slice(0, 7);
    setItems(data);
  }, [filter, expenseItems, revenueItems]);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Transactions — {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => date && setSelectedDate(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="bg-gray-200 text-black text-sm px-3 py-1.5 rounded-full cursor-pointer focus:outline-none w-auto"
        />
      </div>
      <div className="flex gap-4 mb-4 border-b border-gray-200 pb-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-sm font-medium ${
              filter === f.value
                ? "text-teal-600 border-b-2 border-teal-600"
                : "text-gray-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {items.length ? (
          items.map((tx, index) => (
            <TransactionItem key={`${tx.id}-${index}`} item={tx} />
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No data for this period.</p>
        )}
      </div>
    </div>
  );
};

export default DynamicTransactionList;