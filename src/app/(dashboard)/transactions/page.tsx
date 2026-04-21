"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { Search, Plus, Trash2, Download } from "lucide-react";
import styles from "./transactions.module.css";

export default function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction, mounted } = useTransactions();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ merchant: "", amount: "", date: "", category: "Food", type: "expense" });

  if (!mounted) return null; // Avoid hydration mismatch

  const filtered = transactions.filter(t => 
    t.merchant.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.merchant || !formData.amount || !formData.date) return;
    
    addTransaction({
      merchant: formData.merchant,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      type: formData.type as "expense" | "income"
    });
    setShowModal(false);
    setFormData({ merchant: "", amount: "", date: "", category: "Food", type: "expense" });
  };

  const exportCSV = () => {
    const headers = ["Date", "Merchant", "Category", "Type", "Amount"];
    const rows = transactions.map(t => [t.date, t.merchant, t.category, t.type, t.amount.toString()]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-col gap-6 relative">
      <header className="flex-row items-center justify-between" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="title">Transactions</h1>
          <p className="subtitle">Manage all your incomes and expenses.</p>
        </div>
        <div className="flex-row gap-2">
          <button className="btn btn-secondary" onClick={exportCSV}>
            <Download size={16} className="mr-2" /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} className="mr-1" /> Add Manual
          </button>
        </div>
      </header>

      <div className="glass-panel" style={{ padding: '0' }}>
        <div className={styles.tableToolbar}>
          <div className={styles.searchBox}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search by merchant, category..." 
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Category</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "3rem" }} className="text-muted">
                    No transactions found.
                  </td>
                </tr>
              ) : filtered.map(t => (
                <tr key={t.id}>
                  <td className="text-muted">{t.date}</td>
                  <td className="font-medium text-foreground">{t.merchant}</td>
                  <td>
                    <span className={styles.categoryBadge}>{t.category}</span>
                  </td>
                  <td style={{ textAlign: "right", color: t.type === 'income' ? 'var(--success)' : 'var(--foreground)' }}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </td>
                  <td style={{ width: '40px' }}>
                    <button onClick={() => deleteTransaction(t.id)} className={styles.iconBtn}>
                      <Trash2 size={16} className="text-danger" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass-panel`}>
            <h2 className="title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add Transaction</h2>
            <form onSubmit={handleSubmit} className="flex-col gap-4">
              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Type</label>
                <select className="input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Date</label>
                <input type="date" className="input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div>
                <label className="text-sm text-muted font-medium mb-1 block">Merchant</label>
                <input type="text" className="input" placeholder="E.g. Amazon" required value={formData.merchant} onChange={e => setFormData({...formData, merchant: e.target.value})} />
              </div>
              <div className="flex-row gap-4">
                <div style={{ flex: 1 }}>
                  <label className="text-sm text-muted font-medium mb-1 block">Amount ($)</label>
                  <input type="number" step="0.01" className="input" placeholder="0.00" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="text-sm text-muted font-medium mb-1 block">Category</label>
                  <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Housing">Housing</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-row justify-between mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
