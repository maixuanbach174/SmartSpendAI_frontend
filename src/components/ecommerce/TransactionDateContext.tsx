"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface TransactionDateContextType {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const TransactionDateContext = createContext<TransactionDateContextType | undefined>(undefined);

export const TransactionDateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <TransactionDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </TransactionDateContext.Provider>
  );
};

export function useTransactionDate() {
  const context = useContext(TransactionDateContext);
  if (!context) {
    throw new Error("useTransactionDate must be used within a TransactionDateProvider");
  }
  return context;
}