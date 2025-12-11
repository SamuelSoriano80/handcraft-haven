"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../landing.module.css";

export default function SignUpSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      {/* Navigation */}
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Handcraft Haven</Link>
        <nav className={styles.nav} aria-label="Main Navigation">
          <Link href="/shop" className={styles.navLink}>Shop</Link>
          <Link href="/sellers" className={styles.navLink}>Sellers</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <button className={styles.loginButton}>Log In</button>
        </nav>
      </header>

      <main className={styles.container}>
        <section className={styles.section} style={{ textAlign: "center", padding: "4rem 0" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✓</div>
          <h1 className={styles.sectionTitle}>Account Created Successfully!</h1>
          <p className={styles.subtitle}>
            Welcome to Handcraft Haven! Your seller profile has been created.
          </p>
          <p style={{ fontSize: "1rem", color: "#666", marginTop: "1rem" }}>
            You will be redirected to your dashboard in 3 seconds...
          </p>
          <Link href="/dashboard" className={styles.primaryButton} style={{ marginTop: "2rem", display: "inline-block" }}>
            Go to Dashboard Now
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </>
  );
}
