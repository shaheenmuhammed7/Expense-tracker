"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, ScanLine, Loader2, Plus } from "lucide-react";
import Tesseract from "tesseract.js";
import { useTransactions } from "@/hooks/useTransactions";
import styles from "./receipts.module.css";

export default function ReceiptScannerPage() {
  const { addTransaction } = useTransactions();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResult, setScanResult] = useState<{ merchant: string; amount: string; date: string } | null>(null);
  const [saved, setSaved] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setScanResult(null);
      setSaved(false);
      setProgress(0);
    }
  };

  const handleScan = async () => {
    if (!preview) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      const result = await Tesseract.recognize(preview, 'eng', {
        logger: m => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      const text = result.data.text;
      
      // Basic OCR Regex Extractors (mock/simple logic)
      const amountMatch = text.match(/\$?\s*(\d+\.\d{2})/);
      const amount = amountMatch ? amountMatch[1] : "";
      
      const dateMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{2,4})/);
      const dateRaw = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
      
      // Assume the very first non-empty line is merchant name
      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
      const merchant = lines.length > 0 ? lines[0].replace(/[^a-zA-Z\s]/g, '').trim() : "Unknown Merchant";

      setScanResult({
        merchant: merchant || "Unknown Merchant",
        amount: amount || "0.00",
        date: new Date().toISOString().split('T')[0] // Fallback to today for demo
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSave = () => {
    if (!scanResult) return;
    addTransaction({
      merchant: scanResult.merchant,
      amount: parseFloat(scanResult.amount),
      date: scanResult.date,
      category: "Food", // Default category
      type: "expense"
    });
    setSaved(true);
  };

  return (
    <div className="flex-col gap-6">
      <header className="flex-row items-center justify-between" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="title">AI Receipt Scanner</h1>
          <p className="subtitle">Upload a receipt and let AI extract the details instantly.</p>
        </div>
      </header>

      <div className={styles.container}>
        {/* Upload Zone */}
        <div className="glass-panel" style={{ flex: 1 }}>
          <h3 className="text-lg font-semibold mb-4">Upload Receipt</h3>
          
          {!preview ? (
            <div 
              className={styles.uploadZone}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={48} className="text-primary mb-4" />
              <p className="font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-sm text-muted">PNG, JPG, or PDF (max. 10MB)</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }} 
              />
            </div>
          ) : (
            <div className="flex-col gap-4">
              <div className={styles.previewContainer}>
                <img src={preview} alt="Receipt Preview" className={styles.previewImage} />
                <button 
                  className={styles.changeBtn}
                  onClick={() => { setFile(null); setPreview(null); setScanResult(null); }}
                >
                  Change File
                </button>
              </div>
              
              {!scanResult && !isScanning && (
                <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={handleScan}>
                  <ScanLine size={18} className="mr-2" /> Start AI Scan
                </button>
              )}
              
              {isScanning && (
                <div className={styles.scanningBox}>
                  <Loader2 size={24} className={styles.spinner} />
                  <span>Analyzing receipt... {progress}%</span>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Zone */}
        <div className="glass-panel" style={{ flex: 1 }}>
          <h3 className="text-lg font-semibold mb-4">Extracted Data</h3>
          
          {!scanResult && !isScanning && (
            <div className={styles.emptyState}>
              <ScanLine size={32} className="text-muted mb-3" />
              <p className="text-muted">Awaiting scan results...</p>
            </div>
          )}

          {isScanning && (
            <div className={styles.emptyState}>
              <p className="text-primary animate-pulse">Running OCR Engine...</p>
            </div>
          )}

          {scanResult && (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Merchant Name</label>
                <input 
                  type="text" 
                  className="input" 
                  value={scanResult.merchant}
                  onChange={(e) => setScanResult({...scanResult, merchant: e.target.value})}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Amount ($)</label>
                <input 
                  type="number" 
                  className="input" 
                  value={scanResult.amount}
                  onChange={(e) => setScanResult({...scanResult, amount: e.target.value})}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Date</label>
                <input 
                  type="date" 
                  className="input" 
                  value={scanResult.date}
                  onChange={(e) => setScanResult({...scanResult, date: e.target.value})}
                />
              </div>

              {saved ? (
                <div className="flex-row items-center justify-center p-3 mt-4 text-success" style={{ background: 'rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                  <CheckCircle2 size={18} className="mr-2" /> Transaction Saved!
                </div>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleSave}>
                  <Plus size={18} className="mr-2" /> Approve & Save
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
