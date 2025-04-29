"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";

export const EcommerceMetrics = () => {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <ExpenseCard 
        emoji="💸" 
        label="Expenses" 
        amount="$1,200" 
        changeRate="5.2%" 
        changeType="up" 
      />
      {/* <!-- Metric Item Start --> */}
      <ExpenseCard 
        emoji="💰" 
        label="Revenue"
        amount="$3,500"
        changeRate="2.5%"
        changeType="up"
      /> 
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  emoji: string;
  label: string;
  amount: string;
  changeRate: string;
  changeType?: "up" | "down";
};

const ExpenseCard = ({ emoji, label, amount, changeRate, changeType = "up" }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      {/* Icon + Date Picker */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <span className="text-xl">{emoji}</span>
          </div>

          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date as Date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            showFullMonthYearPicker
            className="bg-gray-200 max-w-20 text-black text-sm px-3 py-1.5 rounded-full transition duration-200 cursor-pointer focus:outline-none"
            calendarClassName="!z-[60]"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-xl dark:text-white/90">
            {amount}
          </h4>
        </div>
        <Badge
          color={
            label.toLowerCase().includes("expense") && changeType === "up"
              ? "error"
              : changeType === "up"
              ? "success"
              : "error"
          }
          >
          {changeType === "up" ? <ArrowUpIcon /> : <ArrowDownIcon />}
          {changeRate}
      </Badge>
      </div>
    </div>
  );
};

export default ExpenseCard;
