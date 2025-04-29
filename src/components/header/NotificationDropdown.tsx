// NotificationDropdownFinance.tsx
"use client";
import React, { useState, useMemo } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { ArrowDownIcon, ArrowUpIcon } from "../../icons/index";
import Link from "next/link";

// Notification type
interface Notification {
  id: number;
  type: "expense" | "income";
  amount: number;
  category: string;
  icon: string;
  time: string;
}

// Pools for expense and revenue categories
const expenseCategories = [
  { category: "Groceries", icon: "🛒" },
  { category: "Dining", icon: "🍽️" },
  { category: "Transport", icon: "🚕" },
  { category: "Utilities", icon: "🔌" },
  { category: "Shopping", icon: "🛍️" },
];
const revenueCategories = [
  { category: "Salary", icon: "💰" },
  { category: "Stocks", icon: "📈" },
  { category: "Crypto", icon: "🪙" },
  { category: "Dividends", icon: "💵" },
];
const timeOptions = [
  "5 min ago",
  "15 min ago",
  "30 min ago",
  "1 hr ago",
  "2 hrs ago",
  "Yesterday",
  "2 days ago",
];

// Utility to generate random integer
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a diverse set of notifications
function generateNotifications(count: number): Notification[] {
  const list: Notification[] = [];
  for (let i = 0; i < count; i++) {
    const isExpense = Math.random() < 0.7; // 70% chance expense
    const pool = isExpense ? expenseCategories : revenueCategories;
    const { category, icon } = pool[randomInt(0, pool.length - 1)];
    const amount = parseFloat(
      (
        Math.random() * (isExpense ? 200 : 3000) +
        (isExpense ? 5 : 1000)
      ).toFixed(2)
    );
    const time = timeOptions[randomInt(0, timeOptions.length - 1)];
    list.push({
      id: Date.now() + i,
      type: isExpense ? "expense" : "income",
      amount,
      category,
      icon,
      time,
    });
  }
  return list;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  // Generate 8 notifications on mount
  const sampleNotifications = useMemo(() => generateNotifications(8), []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
    if (notifying) setNotifying(false);
  }

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-gray-500 bg-white border border-gray-200 rounded-full w-11 h-11 hover:text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition"
      >
        {notifying && (
          <span className="absolute top-1/4 right-1/4 inline-flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative rounded-full bg-orange-400 h-2 w-2"></span>
          </span>
        )}
        <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v4a2 2 0 01-2 2h16a2 2 0 01-2-2V8a6 6 0 00-6-6z" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-lg p-4 dark:border-gray-800 dark:bg-gray-900 z-50"
      >
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Recent Activity
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {sampleNotifications.length} new
          </span>
        </div>
        <ul className="space-y-2">
          {sampleNotifications.map((n) => {
            const isExpense = n.type === "expense";
            return (
              <DropdownItem
                key={n.id}
                onItemClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div className="flex-shrink-0 p-2 bg-gray-100 rounded-full dark:bg-gray-800">
                  <span
                    className={`w-5 h-5 flex items-center justify-center ${
                      isExpense ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {n.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {isExpense ? (
                      <ArrowDownIcon className="inline w-4 h-4 text-red-500 mr-1 align-text-bottom" />
                    ) : (
                      <ArrowUpIcon className="inline w-4 h-4 text-green-500 mr-1 align-text-bottom" />
                    )}
                    <span className="font-medium">${n.amount.toFixed(2)}</span> on{' '}
                    <span className="font-medium">{n.category}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                </div>
              </DropdownItem>
            );
          })}
        </ul>
        <Link
          href="#"
          className="block mt-4 text-center text-sm font-medium text-indigo-600 hover:underline"
        >
          View All Activity
        </Link>
      </Dropdown>
    </div>
  );
}
