// src/components/ecommerce/StatisticsChart.tsx
"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ChartTab from "../common/ChartTab";
import { ApexOptions } from "apexcharts";

// Dynamically load the chart on the client
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Utility: random integer in [min,max]
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate 12 months of fake income/expense data
function generateFakeSeries(year: Date) {
  const income: number[] = [];
  const expense: number[] = [];
  for (let m = 0; m < 12; m++) {
    // Expenses: $500–$5k, Income: $2k–$10k
    expense.push(randomInt(500, 2000));
    income.push(randomInt(1000, 5000));
  }
  return { income, expense };
}

export default function StatisticsChart() {
  // State for the selected year
  const [selectedYear, setSelectedYear] = useState(new Date());
  
  // Regenerate data when year changes
  const { income, expense } = useMemo(
    () => generateFakeSeries(selectedYear),
    [selectedYear]
  );

  // Build the series array for ApexCharts
  const series = useMemo(
    () => [
      { name: "Income", data: income },
      { name: "Expenses", data: expense },
    ],
    [income, expense]
  );

  // Chart configuration
  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#10B981", "#EF4444"], // green for income, red for expenses
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: [2, 2] },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: { x: { format: "MMM yyyy" } },
    xaxis: {
      type: "category",
      categories: [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
  };

  const yearLabel = selectedYear.getFullYear();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      {/* Header with year picker */}
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Statistics
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Annual Overview for {yearLabel}
          </p>
        </div>
        <div className="flex items-center w-full gap-3 sm:justify-end">
          <DatePicker
            selected={selectedYear}
            onChange={(date) => date && setSelectedYear(date)}
            showYearPicker
            dateFormat="yyyy"
            className="bg-gray-200 text-black text-sm px-3 py-1.5 rounded-full cursor-pointer focus:outline-none w-auto"
          />
          <ChartTab />
        </div>
      </div>

      {/* Chart */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
