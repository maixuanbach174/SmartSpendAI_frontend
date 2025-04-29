"use client";
import React, { useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { AnalyticsData } from "@/mock";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function PieChartOne() {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(2024);

  const filteredData = AnalyticsData.find(
    (data) => data.month === selectedMonth && data.year === selectedYear
  );

  const series = filteredData
    ? [
        filteredData.transportation,
        filteredData.food,
        filteredData.personal,
        filteredData.others,
      ]
    : [0, 0, 0, 0];

  const options: ApexOptions = {
    chart: {
      type: "pie",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#465FFF", "#9CB9FF", "#FF4560", "#00E396"],
    labels: ["Transportation", "Foods", "Personal", "Others"],
    tooltip: {
      y: {
        formatter: (val: number) => `${val}$`,
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-4 mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="form-select border border-gray-300 rounded-md p-2 text-sm focus:outline-none"
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
          className="form-select border border-gray-300 rounded-md p-2 text-sm focus:outline-none"
        >
          {[2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div id="chartPie" className="min-w-[300px]">
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          height={350}
        />
      </div>
    </div>
  );
}