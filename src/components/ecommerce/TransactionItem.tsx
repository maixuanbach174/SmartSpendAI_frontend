import React from "react";
import { Transaction } from "../../data/transactions";

const TransactionItem: React.FC<{ item: Transaction }> = ({ item }) => {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200">
      <div className="flex items-center gap-4">
        <div className="text-2xl">{item.icon}</div>
        <div>
          <p className="font-semibold text-gray-800">{item.name}</p>
          <p className="text-sm text-gray-400">{item.source}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-800">${item.amount.toFixed(2)}</p>
        <p className="text-sm text-gray-400">{item.date}</p>
      </div>
    </div>
  );
};

export default TransactionItem;
