"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  WalletCards, 
  ScanLine, 
  Sparkles, 
  Settings, 
  Activity,
  LogOut
} from "lucide-react";
import styles from "./Sidebar.module.css";
import { useUser } from "@/hooks/useUser";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const primaryLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transactions", href: "/transactions", icon: WalletCards },
    { name: "AI Scanner", href: "/receipts", icon: ScanLine },
    { name: "Insights Assistant", href: "/insights", icon: Sparkles },
    { name: "Analytics", href: "/analytics", icon: Activity },
  ];

  const secondaryLinks = [
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className={styles.sidebar}>
      <Link href="/dashboard" className={styles.logo}>
        <div className={styles.logoIcon}>
          <WalletCards size={18} />
        </div>
        <span>Lumina</span>
      </Link>

      <div className={styles.navSection}>
        <div className={styles.navLabel}>Menu</div>
        <ul className={styles.navList}>
          {primaryLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                >
                  <Icon size={18} />
                  <span>{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={styles.bottomNav}>
        <div className={styles.navSection}>
          <ul className={styles.navList}>
            {secondaryLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                  >
                    <Icon size={18} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className={styles.userCard}>
          <div className={styles.avatar} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>
          <LogOut size={16} className="text-muted ml-auto" />
        </div>
      </div>
    </aside>
  );
}
