import Link from "next/link";
import { ArrowRight, Sparkles, ScanLine, WalletCards } from "lucide-react";
import styles from "./page.module.css";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <WalletCards size={24} className="text-primary" />
          <span>Lumina</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className="btn btn-secondary">Login</Link>
          <Link href="/dashboard" className="btn btn-primary">Get Started</Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.heroGlow}></div>
        
        <div className={styles.badge}>
          <Sparkles size={14} className="text-primary" />
          <span>The era of AI finance is here</span>
        </div>
        
        <h1 className={styles.headline}>
          Track expenses with <br/>
          <span className={styles.gradientText}>Intelligent Precision.</span>
        </h1>
        
        <p className={styles.subheadline}>
          Automatically parse receipts, categorize spending, and act on AI-driven financial insights. A premium financial OS built for the modern era.
        </p>
        
        <div className={styles.ctas}>
          <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem' }}>
            Enter Dashboard <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </Link>
        </div>
        
        <div className={styles.featureGrid}>
          <div className="glass-panel">
            <ScanLine size={32} className="text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Receipt Scanning</h3>
            <p className="text-muted text-sm">Snap a photo and our OCR extracts merchants, dates, and amounts instantly.</p>
          </div>
          
          <div className="glass-panel">
            <Sparkles size={32} className="text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
            <p className="text-muted text-sm">Chat with your finances. Ask "Where did I spend most?" or get personalized savings tips.</p>
          </div>
          
          <div className="glass-panel">
            <WalletCards size={32} className="text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Smart Budgets</h3>
            <p className="text-muted text-sm">Visual trends and automatic categorization powered by machine learning algorithms.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
