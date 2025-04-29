export type TransactionType = "all" | "revenue" | "expense";

export interface Transaction {
  id: number;
  name: string;
  category: string;
  icon: string; // emoji or icon component
  type: TransactionType;
  amount: number;
  date: string;
  source: string;
}

export const transactions: Transaction[] = [
  {
    id: 1,
    name: "GTR 5",
    category: "Gaming",
    icon: "🎮",
    type: "expense",
    amount: 160,
    date: "17 April 2025",
    source: "Gadget & Gear"
  },
  {
    id: 2,
    name: "Polo Shirt",
    category: "Clothing",
    icon: "👕",
    type: "expense",
    amount: 20,
    date: "17 April 2025",
    source: "XL fashions"
  },
  {
    id: 3,
    name: "Biriyani",
    category: "Food",
    icon: "🏠",
    type: "expense",
    amount: 10,
    date: "17 April 2025",
    source: "Hajir Biriyani"
  },
  {
    id: 4,
    name: "Taxi Fare",
    category: "Transport",
    icon: "🚖",
    type: "expense",
    amount: 12,
    date: "17 April 2025",
    source: "Uber"
  },
  {
    id: 5,
    name: "Keyboard",
    category: "Accessories",
    icon: "⌨️",
    type: "expense",
    amount: 22,
    date: "17 April 2025",
    source: "Gadget & Gear"
  }
];
