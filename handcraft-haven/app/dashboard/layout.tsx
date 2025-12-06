import Link from "next/link";
import styles from "../landing.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.container}>
      {/* Navigation */}
      <header className={styles.header}>
        <div className={styles.logo}>Handcraft Haven</div>
        <nav className={styles.nav} aria-label="Main Navigation">
          <Link href="/shop" className={styles.navLink}>Shop</Link>
          <Link href="/sellers" className={styles.navLink}>Sellers</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <button className={styles.loginButton}>Log In</button>
        </nav>
      </header>

      {children}

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </main>
  );
}
