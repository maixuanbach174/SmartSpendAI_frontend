"use client";

import React, { useState, useEffect } from "react";
import TransactionItem from "./TransactionItem";
import DatePicker from "react-datepicker";
import { Transaction, TransactionType } from "../../data/transactions";

// Utility: generate random integer between min/max inclusive
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Pools for expense and revenue categories
const expenseCategories = [
  { name: "Groceries", icon: "🥦" },
  { name: "Dining", icon: "🍽️" },
  { name: "Transport", icon: "🚕" },
  { name: "Utilities", icon: "💡" },
  { name: "Shopping", icon: "🛍️" },
];
const revenueCategories = [
  { name: "Salary", icon: "💰" },
  { name: "Stocks", icon: "📈" },
  { name: "Crypto", icon: "🪙" },
  { name: "Dividends", icon: "💵" },
  { name: "Interest", icon: "💹" },
];
const sourcePool = [
  "Market",
  "Restaurant",
  "Uber",
  "Electric Co.",
  "Mall",
  "Employer Inc.",
  "Brokerage",
  "Bank",
];

/**
 * Generate transactions of given type ('expense' or 'revenue') for month/year
 * ensuring unique icons for as many as categories
 */
function generateByType(date: Date, type: TransactionType): Transaction[] {
  const pool = type === "expense" ? expenseCategories : revenueCategories;
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const count = randomInt(3, 7);

  // Shuffle categories
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return Array.from({ length: count }).map((_, idx) => {
    const cat = idx < shuffled.length ? shuffled[idx] : shuffled[randomInt(0, shuffled.length - 1)];
    const day = randomInt(1, daysInMonth);
    const amount = parseFloat(
      (Math.random() * (type === "expense" ? 200 : 3000) + (type === "expense" ? 5 : 1000)).toFixed(2)
    );
    const tx = new Date(year, month, day);
    return {
      id: year * 100000 + month * 1000 + day * 10 + idx,
      name: `${cat.name} ${type === "expense" ? "Purchase" : "Income"}`,
      category: cat.name,
      icon: cat.icon,
      type,
      amount,
      date: tx.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
      source: sourcePool[randomInt(0, sourcePool.length - 1)],
    };
  });
}

const filters: { label: string; value: TransactionType }[] = [
  { label: "All", value: "all" },
  { label: "Revenue", value: "revenue" },
  { label: "Expenses", value: "expense" },
];

const DynamicTransactionList: React.FC = () => {
  const [filter, setFilter] = useState<TransactionType>("all");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [items, setItems] = useState<Transaction[]>([]);

  useEffect(() => {
    let expenseItems: Transaction[] = [];
    let revenueItems: Transaction[] = [];

    if (filter === "all" || filter === "expense") {
      expenseItems = generateByType(selectedDate, "expense");
    }
    if (filter === "all" || filter === "revenue") {
      revenueItems = generateByType(selectedDate, "revenue");
    }

    let combined = [...expenseItems, ...revenueItems];
    if (filter === "all" && combined.length > 7) {
      combined = combined.slice(0, 7);
    }
    setItems(combined);
  }, [filter, selectedDate]);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Transactions — {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex gap-2">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="bg-gray-200 text-black text-sm px-3 py-1.5 rounded-full cursor-pointer focus:outline-none w-24"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-4 border-b border-gray-200 pb-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-sm font-medium ${
              filter === f.value ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((tx) => <TransactionItem key={tx.id} item={tx} />)
        ) : (
          <p className="text-center text-gray-500 py-4">No data for this period.</p>
        )}
      </div>
    </div>
  );
};

export default DynamicTransactionList;
