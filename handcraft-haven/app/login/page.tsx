"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../landing.module.css";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    name: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.name || !form.password) {
      setError("Name and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/sellers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          password: form.password
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("sellerId", data._id || data.id);

      const redirectParam = searchParams.get("redirect");
      const redirectFromStorage = localStorage.getItem("redirectAfterLogin");
      const redirectUrl = redirectParam || redirectFromStorage || "/dashboard";
      localStorage.removeItem("redirectAfterLogin");
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  }

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
        <h1 className={styles.sectionTitle}>Log In to Handcraft Haven</h1>
        <p className={styles.subtitle}>Sign in to your seller account</p>

        <div style={{ maxWidth: 500, margin: "0 auto", padding: "2rem 0" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <div style={{ padding: "1rem", backgroundColor: "#ffebee", color: "#c62828", borderRadius: 6 }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Name
              </label>
              <input
                className={styles.input}
                type="text"
                placeholder="Your seller name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{ width: "100%", boxSizing: "border-box" }}
                autoFocus
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Password
              </label>
              <input
                className={styles.input}
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <button
              className={styles.primaryButton}
              type="submit"
              disabled={loading}
              style={{ padding: "1rem", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Logging in…" : "Log In"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
              Don't have an account? <Link href="/signup" style={{ color: "#000", textDecoration: "underline" }}>Sign up here</Link>
            </p>
          </form>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </>
  );
}
