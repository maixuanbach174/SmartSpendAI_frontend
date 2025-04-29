// src/components/ecommerce/MonthlyTargetDynamic.tsx
"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useTransactionDate } from "./TransactionDateContext";
import { ApexOptions } from "apexcharts";

// Dynamically import the chart (client only)
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Utility: random integer between min/max inclusive
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function MonthlyTargetDynamic() {
  const { selectedDate } = useTransactionDate();
  const [mounted, setMounted] = useState(false);

  // State for target, actual, series, and month-over-month change
  const [target, setTarget] = useState(0);
  const [actual, setActual] = useState(0);
  const [series, setSeries] = useState<number[]>([0]);
  const [changeLabel, setChangeLabel] = useState("+0%");

  // Mount guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Regenerate values whenever month changes (after mount)
  useEffect(() => {
    if (!mounted) return;

    // 1. Pick a random target between 10k and 50k
    const rndTarget = randomInt(1000, 5000);
    // 2. Pick actual between 0 and rndTarget
    const rndActual = randomInt(0, rndTarget);
    setTarget(rndTarget);
    setActual(rndActual);

    // 3. Compute progress %
    const pct = rndTarget > 0 ? (rndActual / rndTarget) * 100 : 0;
    setSeries([parseFloat(pct.toFixed(2))]);

    // 4. Compute previous month “actual” for change label
    const prevActual = randomInt(0, rndTarget);
    const diff = rndActual - prevActual;
    const chPct = prevActual > 0 ? (diff / prevActual) * 100 : 0;
    const sign = chPct >= 0 ? "+" : "";
    setChangeLabel(`${sign}${chPct.toFixed(1)}%`);
  }, [selectedDate, mounted]);

  // Chart options (can remain static)
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: { size: "80%" },
        track: { background: "#E4E7EC", strokeWidth: "100%", margin: 5 },
        dataLabels: {
          name: { show: false },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: { type: "solid", colors: ["#465FFF"] },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };

  // Don’t render random data on the server
  if (!mounted) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-100 md:p-6 h-[450px]" />
    );
  }

  // Format the selected month/year
  const monthYear = selectedDate.toLocaleDateString("en-US", {
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Target 🎯
            </h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400 text-theme-sm">
              Target you’ve set for {monthYear}
            </p>
          </div>

          {/* “More” dropdown */}
          <div className="relative inline-block">
            <button onClick={() => setMounted((m) => m)} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            {/* Add your Dropdown logic here if needed */}
          </div>
        </div>

        {/* Chart */}
        <div className="relative mt-6">
          <div className="max-h-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
            {changeLabel}
          </span>
        </div>

        {/* Footer Text */}
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base dark:text-gray-400">
          You’ve achieved ${actual.toLocaleString()} of your ${target.toLocaleString()} target this month.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <StatBlock label="Target" value={`$${target.toLocaleString()}`} up={false} />
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />
        <StatBlock label="Revenue" value={`$${actual.toLocaleString()}`} up={series[0] >= 0} />
        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />
        <StatBlock label="Today" value={`$${randomInt(0, actual).toLocaleString()}`} up />
      </div>
    </div>
  );
}

// Small helper for the bottom stats
function StatBlock({
  label,
  value,
  up,
}: {
  label: string;
  value: string;
  up: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
        {label}
      </p>
      <p className={`flex items-center justify-center gap-1 text-base font-semibold sm:text-lg ${
        up
          ? "text-gray-800 dark:text-white/90"
          : "text-gray-800 dark:text-white/90"
      }`}>
        {value}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d={
              up
                ? "M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
                : "M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
            }
            fill={up ? "#039855" : "#D92D20"}
          />
        </svg>
      </p>
    </div>
  );
}
