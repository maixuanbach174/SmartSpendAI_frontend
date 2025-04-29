"use client";

import React, { useState } from "react";
import TransactionItem from "./TransactionItem";
import { transactions, TransactionType } from "../../data/transactions";

const filters: { label: string; value: TransactionType }[] = [
  { label: "All", value: "all" },
  { label: "Revenue", value: "revenue" },
  { label: "Expenses", value: "expense" }
];

const TransactionList: React.FC = () => {
  const [filter, setFilter] = useState<TransactionType>("all");

  const filteredTransactions = transactions.filter(
    (t) => filter === "all" || t.type === filter
  );

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Transaction</h2>
        <button className="text-sm text-blue-500 hover:underline">View All</button>
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
        {filteredTransactions.map((item) => (
          <TransactionItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;
