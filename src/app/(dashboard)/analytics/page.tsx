"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useTransactions } from "@/hooks/useTransactions";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

export default function AnalyticsPage() {
  const { transactions, mounted } = useTransactions();

  if (!mounted) return null;

  // Aggregate expenses for the pie chart
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const categoryTotals: Record<string, number> = {};
  
  expenseTransactions.forEach(t => {
    if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
    categoryTotals[t.category] += t.amount;
  });

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['var(--primary)', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6'];

  // Mock monthly data for the bar chart
  const monthlyData = [
    { name: 'Week 1', amount: 450 },
    { name: 'Week 2', amount: 320 },
    { name: 'Week 3', amount: 890 },
    { name: 'Week 4', amount: 500 },
  ];

  return (
    <div className="flex-col gap-6">
      <header className="flex-row items-center justify-between" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="title">Analytics</h1>
          <p className="subtitle">Deep dive into your spending habits.</p>
        </div>
      </header>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel">
          <p className="text-muted font-medium mb-1">Highest Expense Category</p>
          <div className="text-2xl font-bold mb-2">
            {pieData.length > 0 ? pieData.sort((a,b) => b.value - a.value)[0].name : "N/A"}
          </div>
          <div className="flex-row items-center text-sm text-danger gap-1">
            <TrendingUp size={14} /> +12% vs last month
          </div>
        </div>

        <div className="glass-panel">
          <p className="text-muted font-medium mb-1">Average Daily Spend</p>
          <div className="text-2xl font-bold mb-2">$42.50</div>
          <div className="flex-row items-center text-sm text-success gap-1">
            <TrendingDown size={14} /> -5% vs last month
          </div>
        </div>

        <div className="glass-panel">
          <p className="text-muted font-medium mb-1">Savings Rate</p>
          <div className="text-2xl font-bold mb-2">32%</div>
          <div className="flex-row items-center text-sm text-success gap-1">
            On track to hit goal <ArrowRight size={14} className="ml-1" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Category Breakdown */}
        <div className="glass-panel">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown by Category</h3>
          <div style={{ width: '100%', height: 350 }}>
            {pieData.length === 0 ? (
              <div className="flex-col justify-center items-center h-full text-muted">No expenses to display.</div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Weekly Spending Trend */}
        <div className="glass-panel">
          <h3 className="text-lg font-semibold mb-4">Weekly Spending Trend</h3>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                  formatter={(value: number) => [`$${value}`, 'Spent']}
                />
                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
