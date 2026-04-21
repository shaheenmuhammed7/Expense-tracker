"use client";

import { useState, useEffect } from "react";
import { User, Bell, Palette, Moon, Shield, Save, CheckCircle2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function SettingsPage() {
  const { user, setUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  // Initialize form state
  useEffect(() => {
    if (user.name && !name) setName(user.name);
    if (user.email && !email) setEmail(user.email);
  }, [user.name, user.email]);

  const handleSave = () => {
    setUser({ ...user, name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-col gap-6" style={{ maxWidth: '800px' }}>
      <header className="flex-row items-center justify-between" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="title">Settings</h1>
          <p className="subtitle">Manage your account preferences and app configurations.</p>
        </div>
      </header>

      <div className="flex-col gap-6">
        {/* Profile Settings */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="text-lg font-semibold mb-4 flex-row items-center gap-2">
            <User size={18} className="text-primary" /> Profile Details
          </h3>
          <div className="flex-col gap-4">
            <div className="flex-row gap-4">
              <div style={{ flex: 1 }}>
                <label className="text-sm text-muted font-medium mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  className="input" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="text-sm text-muted font-medium mb-1 block">Email Address</label>
                <input 
                  type="email" 
                  className="input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="text-lg font-semibold mb-4 flex-row items-center gap-2">
            <Palette size={18} className="text-primary" /> Preferences
          </h3>
          <div className="flex-col gap-4">
            <div className="flex-row justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <p className="font-medium flex-row items-center gap-2">
                  <Moon size={16} className="text-muted" /> Dark Mode
                </p>
                <p className="text-sm text-muted font-normal">Use the dark theme by default.</p>
              </div>
              <div style={{ width: '40px', height: '24px', background: 'var(--primary)', borderRadius: '12px', position: 'relative' }}>
                <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
              </div>
            </div>

            <div className="flex-row justify-between items-center pt-2">
              <div>
                <p className="font-medium flex-row items-center gap-2">
                  <Shield size={16} className="text-muted" /> Two-Factor Authentication
                </p>
                <p className="text-sm text-muted font-normal">Add an extra layer of security to your account.</p>
              </div>
              <button className="btn btn-secondary">Enable 2FA</button>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="text-lg font-semibold mb-4 flex-row items-center gap-2">
            <Bell size={18} className="text-primary" /> Notifications
          </h3>
          <div className="flex-col gap-4">
            <div className="flex-row justify-between items-center">
              <div>
                <p className="font-medium">Unusual Spending Alerts</p>
                <p className="text-sm text-muted font-normal">Notify me if AI detects an anomaly.</p>
              </div>
              <div style={{ width: '40px', height: '24px', background: 'var(--primary)', borderRadius: '12px', position: 'relative' }}>
                <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
              </div>
            </div>
          </div>
        </section>

        <div className="flex-row justify-end mt-4 items-center gap-4">
          {saved && <div className="text-success flex-row items-center"><CheckCircle2 size={16} className="mr-1" /> Saved!</div>}
          <button className="btn btn-primary px-6" onClick={handleSave}>
            <Save size={18} className="mr-2" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
