"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard } from "lucide-react";
import styles from "./dashboard.module.css";

const initialData = [
  { name: 'Jan', expenses: 2400, income: 4000 },
  { name: 'Feb', expenses: 1398, income: 3000 },
  { name: 'Mar', expenses: 9800, income: 2000 },
  { name: 'Apr', expenses: 3908, income: 2780 },
  { name: 'May', expenses: 4800, income: 1890 },
  { name: 'Jun', expenses: 3800, income: 2390 },
];

const categoryData = [
  { name: 'Housing', amount: 1200 },
  { name: 'Food', amount: 600 },
  { name: 'Transport', amount: 300 },
  { name: 'Entertainment', amount: 200 },
];

export default function DashboardPage() {
  const { transactions } = useTransactions();
  const [mounted, setMounted] = useState(false);
  const [metrics, setMetrics] = useState({
    balance: "0.00" // Acts as our editable Starting Balance
  });
  const [editingField, setEditingField] = useState<"balance" | null>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("lumina_metrics");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.balance) setMetrics({ balance: parsed.balance });
      } catch(e) {}
    }
  }, []);

  const handleSaveMetric = (field: "balance", value: string) => {
    const newMetrics = { ...metrics, [field]: value };
    setMetrics(newMetrics);
    localStorage.setItem("lumina_metrics", JSON.stringify(newMetrics));
    setEditingField(null);
  };

  const calculatedIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const calculatedExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const computedTotalBalance = Number(metrics.balance) + calculatedIncome - calculatedExpense;

  const renderEditableMetric = (field: "balance", displayValue: number) => {
    if (editingField === field) {
      return (
        <input 
          type="number"
          step="0.01"
          className="input mb-1"
          style={{ fontSize: '1.25rem', height: '2rem', padding: '0.2rem 0.5rem', width: '150px' }}
          defaultValue={metrics.balance}
          autoFocus
          onBlur={(e) => handleSaveMetric(field, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveMetric(field, e.currentTarget.value);
          }}
        />
      );
    }
    return (
      <div 
        className="text-2xl font-bold mb-1 cursor-pointer transition-opacity"
        style={{ cursor: "text" }}
        title="Click to edit starting balance"
        onClick={() => setEditingField(field)}
      >
        ${Number(displayValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    );
  };

  if (!mounted) return null;

  return (
    <div className="flex-col gap-6">
      <header className="flex-row items-center justify-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">Welcome back! Here's your financial overview.</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href='/transactions'}>
          + New Transaction
        </button>
      </header>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className="glass-panel hover:border-primary transition-colors">
          <div className="flex-row justify-between items-center text-muted mb-2">
            <span className="font-medium">Total Balance</span>
            <CreditCard size={18} />
          </div>
          {renderEditableMetric("balance", computedTotalBalance)}
          <div className="flex-row items-center gap-1 text-sm text-muted">
            <span>Includes Starting Bal: ${Number(metrics.balance).toLocaleString()}</span>
          </div>
        </div>

        <div className="glass-panel">
          <div className="flex-row justify-between items-center text-muted mb-2">
            <span className="font-medium">Calculated Income</span>
            <ArrowUpRight size={18} className="text-success" />
          </div>
          <div className="text-2xl font-bold mb-1">
             ${calculatedIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex-row items-center gap-1 text-sm text-muted">
            <span>From Transactions</span>
          </div>
        </div>

        <div className="glass-panel">
          <div className="flex-row justify-between items-center text-muted mb-2">
            <span className="font-medium">Calculated Expenses</span>
            <ArrowDownRight size={18} className="text-danger" />
          </div>
          <div className="text-2xl font-bold mb-1">
             ${calculatedExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex-row items-center gap-1 text-sm text-muted">
            <span>From Transactions</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className={styles.chartsGrid}>
        <div className="glass-panel" style={{ gridColumn: "span 2" }}>
          <h3 className="text-lg font-semibold mb-4">Cash Flow Overview</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={initialData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="income" stroke="var(--success)" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expenses" stroke="var(--danger)" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Bar dataKey="amount" fill="var(--primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
