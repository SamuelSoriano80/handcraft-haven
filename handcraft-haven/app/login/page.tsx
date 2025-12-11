import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./LoginForm";
import styles from "../landing.module.css";

export default function LoginPage() {
  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Handcraft Haven</Link>
        <nav className={styles.nav} aria-label="Main Navigation">
          <Link href="/shop" className={styles.navLink}>Shop</Link>
          <Link href="/sellers" className={styles.navLink}>Sellers</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <button className={styles.loginButton} disabled>Log In</button>
        </nav>
      </header>

      <main className={styles.container}>
        <h1 className={styles.sectionTitle}>Log In</h1>
        <p className={styles.subtitle}>Log in to your seller account</p>

        <Suspense fallback={<p style={{ textAlign: "center", padding: "2rem" }}>Loading...</p>}>
          <LoginForm />
        </Suspense>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </>
  );
}
