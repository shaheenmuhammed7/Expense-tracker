"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import styles from "./insights.module.css";
import { useTransactions } from "@/hooks/useTransactions";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const MOCK_INSIGHTS = [
  "Based on your recent transactions, you are spending 25% more on Dining Out compared to last month. Consider cooking at home to save roughly $150.",
  "I noticed a recurring charge of $15.99 for Netflix. If you aren't using it frequently, canceling could save you $191 a year.",
  "Great job on keeping your Transport expenses low this week! You are 10% under budget.",
  "A quick projection indicates that if your current spending rate continues, you will save $450 by the end of the month.",
];

export default function InsightsPage() {
  const { transactions } = useTransactions();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hello! I am your AI Financial Assistant. Ask me anything about your spending, trends, or savings tips." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const mockResponse = MOCK_INSIGHTS[Math.floor(Math.random() * MOCK_INSIGHTS.length)];
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: mockResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex-col gap-6" style={{ height: 'calc(100vh - 4rem)' }}>
      <header className="flex-row items-center justify-between">
        <div>
          <h1 className="title">AI Insights</h1>
          <p className="subtitle">Chat with your personalized financial oracle.</p>
        </div>
      </header>

      <div className={styles.chatContainer}>
        {/* Quick Tips Panel (Sidebar) */}
        <div className={`${styles.quickTips} glass-panel`}>
          <h3 className="text-sm font-semibold mb-4 text-muted flex-row items-center">
            <Sparkles size={14} className="text-primary mr-2" /> Auto-Generated Tips
          </h3>
          <div className="flex-col gap-3">
            <div className={styles.tipCard}>
              <TrendingUp size={16} className="text-success mb-2" />
              <p className="text-xs">Income increased by 5% this quarter.</p>
            </div>
            <div className={styles.tipCard}>
              <TrendingDown size={16} className="text-danger mb-2" />
              <p className="text-xs">Unusual spending detected at Apple Store ($1299).</p>
            </div>
            <div className={styles.tipCard}>
              <Bot size={16} className="text-primary mb-2" />
              <p className="text-xs">Try asking: "What is my biggest expense category?"</p>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className={`${styles.chatBox} glass-panel`}>
          <div className={styles.messagesWrapper}>
            {messages.map((m) => (
              <div key={m.id} className={`${styles.messageRow} ${m.role === 'user' ? styles.userRow : styles.assistantRow}`}>
                <div className={styles.avatar}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`${styles.messageBubble} ${m.role === 'user' ? styles.userBubble : styles.assistantBubble}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                <div className={styles.avatar}><Bot size={16} /></div>
                <div className={`${styles.messageBubble} ${styles.assistantBubble} ${styles.typingIndicator}`}>
                  <span className={styles.dot}></span><span className={styles.dot}></span><span className={styles.dot}></span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSend} className={styles.inputArea}>
            <input 
              type="text" 
              className={styles.chatInput} 
              placeholder="Ask about your budget, trends, etc..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isTyping}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
