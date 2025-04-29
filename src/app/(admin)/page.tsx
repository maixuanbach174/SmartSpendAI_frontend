import type { Metadata } from "next";
import EcommerceMetricsDynamic from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import TransactionList from "@/components/ecommerce/TransactionList";
import { TransactionDateProvider } from "@/components/ecommerce/TransactionDateContext";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <TransactionDateProvider>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-1 col-span-12 xl:col-span-5">
          {/* Left: Transaction List (2/3 width) */}
          <div className="md:col-span-3">
            <TransactionList />
          </div>

          {/* Right: Metrics (1/3 width) */}
          <div className="md:col-span-2">
            <EcommerceMetricsDynamic />
          </div>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>
        <div className="col-span-12">
          <StatisticsChart />
        </div>
      </TransactionDateProvider>
    </div>
  );
}
