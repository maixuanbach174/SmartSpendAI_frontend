"use client";
import React, { useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { AnalyticsData } from "@/mock";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function BarChartOne() {
  const [selectedYear, setSelectedYear] = useState(2024);

  // Filter data for the selected year
  const filteredData = AnalyticsData.filter((data) => data.year === selectedYear);

  // Extract months and total values for the chart
  const months = filteredData.map((data) => data.month);
  const totals = filteredData.map((data) => data.total);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: months, // Use months as categories
    },
    yaxis: {
      title: {
        text: "Total Spending ($)",
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val}`,
      },
    },
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-4 mb-4">
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
      <div id="chartBar" className="min-w-[300px]">
        <ReactApexChart
          options={options}
          series={[{ name: "Total Spending", data: totals }]} // Use totals as data
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}