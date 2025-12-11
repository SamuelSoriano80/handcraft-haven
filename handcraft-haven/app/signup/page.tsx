"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../landing.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    biography: "",
    avatar: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setForm(prev => ({ ...prev, avatar: base64 }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.name || !form.password) {
      setError("Name and password are required");
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name,
      email: form.email || undefined,
      password: form.password,
      biography: form.biography || undefined,
      avatar: form.avatar || undefined
    };

    try {
      const res = await fetch("/api/sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create account");
      }

      router.push("/signup/success");
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
          <button className={styles.loginButton}>Log In</button>
        </nav>
      </header>

      <main className={styles.container}>
        <h1 className={styles.sectionTitle}>Create Your Seller Profile</h1>
        <p className={styles.subtitle}>Join Handcraft Haven and start selling your creations</p>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 0" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <div style={{ padding: "1rem", backgroundColor: "#ffebee", color: "#c62828", borderRadius: 6 }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Name *
              </label>
              <input
                className={styles.input}
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Password *
              </label>
              <input
                className={styles.input}
                type="password"
                placeholder="Enter a strong password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
            </div>


            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Email (Optional)
              </label>
              <input
                className={styles.input}
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: "100%", boxSizing: "border-box" }}
              />
              <p style={{ fontSize: "0.85rem", color: "#d32f2f", marginTop: "0.5rem" }}>
                ⚠️ Your email will be displayed publicly so customers can contact you
              </p>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Biography (Optional)
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Tell customers about yourself and your crafts"
                value={form.biography}
                onChange={e => setForm({ ...form, biography: e.target.value })}
                style={{ width: "100%", boxSizing: "border-box", minHeight: 100 }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                Avatar (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "block" }}
              />
              {form.avatar && (
                <p style={{ fontSize: "0.85rem", color: "#4caf50", marginTop: "0.5rem" }}>
                  ✓ Avatar selected
                </p>
              )}
            </div>

            <button
              className={styles.primaryButton}
              type="submit"
              disabled={loading}
              style={{ padding: "1rem", fontSize: "1rem", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Creating account…" : "Create Seller Account"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
              Already have an account? <Link href="/login" style={{ color: "#000", textDecoration: "underline" }}>Log in</Link>
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
