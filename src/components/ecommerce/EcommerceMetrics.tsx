"use client";

import React, { useEffect, useMemo, useState } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import { useTransactionDate } from "./TransactionDateContext";

// same categories pools
const expenseCategories = [
  { name: "Groceries", icon: "🥦" },
  { name: "Dining", icon: "🍽️" },
  { name: "Transport", icon: "🚕" },
  { name: "Utilities", icon: "🔌" },
  { name: "Shopping", icon: "🛍️" },
];
const revenueCategories = [
  { name: "Salary", icon: "💰" },
  { name: "Stocks", icon: "📈" },
  { name: "Crypto", icon: "🪙" },
  { name: "Dividends", icon: "💵" },
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateByType(date: Date, type: "expense" | "revenue") {
  const pool = type === "expense" ? expenseCategories : revenueCategories;
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const count = randomInt(3, 7);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return Array.from({ length: count }).map((_, i) => {
    const amt = parseFloat(
      ((Math.random() * (type === "expense" ? 200 : 3000)) +
        (type === "expense" ? 5 : 1000)).toFixed(2)
    );
    return { amount: amt };
  });
}

type CardProps = {
  emoji: string;
  label: string;
  amount: number;
  changeRate: string;
  changeType: "up" | "down";
};

const ExpenseCard: React.FC<CardProps> = ({ emoji, label, amount, changeRate, changeType }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
        <span className="text-xl">{emoji}</span>
      </div>
    </div>
    <div className="flex items-end justify-between mt-5">
      <div>
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <h4 className="mt-2 font-bold text-gray-800 text-xl dark:text-white/90">
          ${amount.toFixed(2)}
        </h4>
      </div>
      <Badge color={changeType === "up" ? "success" : "error"}>
        {changeType === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
        {changeRate}
      </Badge>
    </div>
  </div>
);

export default function EcommerceMetricsDynamic() {
  const { selectedDate } = useTransactionDate();

  // ① guard so we only generate random data after hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // ② only compute these once mounted
  const expenseTxs = useMemo(
    () => (mounted ? generateByType(selectedDate, "expense") : []),
    [mounted, selectedDate]
  );
  const revenueTxs = useMemo(
    () => (mounted ? generateByType(selectedDate, "revenue") : []),
    [mounted, selectedDate]
  );

  // ③ if not yet mounted, render an identical “empty” placeholder
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="h-[140px] rounded-2xl border border-gray-200 bg-white animate-pulse" />
        <div className="h-[140px] rounded-2xl border border-gray-200 bg-white animate-pulse" />
      </div>
    );
  }

  // ④ now it’s safe to compute totals & render cards
  const sum = (arr: any[]) => arr.reduce((s, t) => s + t.amount, 0);
  const totalExpense = sum(expenseTxs);
  const totalRevenue = sum(revenueTxs);

  // compare to previous month…
  const prev = new Date(selectedDate);
  prev.setMonth(prev.getMonth() - 1);
  const prevExpense = sum(generateByType(prev, "expense"));
  const prevRevenue = sum(generateByType(prev, "revenue"));
  const pct = (curr: number, prv: number) => (prv>0?`${(((curr-prv)/prv)*100).toFixed(1)}%`:"—");

  return (
    <div className="flex flex-col gap-4">
      <ExpenseCard
        emoji="💸"
        label="Expenses"
        amount={totalExpense}
        changeRate={pct(totalExpense, prevExpense)}
        changeType={totalExpense >= prevExpense ? "up" : "down"}
      />
      <ExpenseCard
        emoji="💰"
        label="Revenue"
        amount={totalRevenue}
        changeRate={pct(totalRevenue, prevRevenue)}
        changeType={totalRevenue >= prevRevenue ? "up" : "down"}
      />
    </div>
  );
}