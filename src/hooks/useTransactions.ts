"use client";
import { useState, useEffect } from "react";

export type Transaction = {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  type: "expense" | "income";
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mock: Transaction[] = [
      { id: "1", merchant: "Apple Store", amount: 1299.0, date: "2026-04-20", category: "Electronics", type: "expense" },
      { id: "2", merchant: "Whole Foods", amount: 145.2, date: "2026-04-19", category: "Food", type: "expense" },
      { id: "3", merchant: "Lumina Salary", amount: 4500.0, date: "2026-04-15", category: "Income", type: "income" },
      { id: "4", merchant: "Uber Rides", amount: 24.5, date: "2026-04-14", category: "Transport", type: "expense" },
      { id: "5", merchant: "Netflix", amount: 15.99, date: "2026-04-10", category: "Entertainment", type: "expense" },
    ];
    const saved = localStorage.getItem("lumina_transactions");
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        setTransactions(mock);
      }
    } else {
      setTransactions(mock);
      localStorage.setItem("lumina_transactions", JSON.stringify(mock));
    }
  }, []);

  const addTransaction = (t: Omit<Transaction, "id">) => {
    const newT = { ...t, id: Date.now().toString() };
    const updated = [newT, ...transactions];
    setTransactions(updated);
    localStorage.setItem("lumina_transactions", JSON.stringify(updated));
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    localStorage.setItem("lumina_transactions", JSON.stringify(updated));
  };

  return { transactions, addTransaction, deleteTransaction, mounted };
}
