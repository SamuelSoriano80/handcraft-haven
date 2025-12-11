"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "../components/LoginButton";
import styles from "../landing.module.css";

export default function SellersPage() {
  const [sellers, setShellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sellers")
      .then(res => res.json())
      .then(data => {
        setShellers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching sellers:", err);
        setLoading(false);
      });
  }, []);

  function trimBio(biography: string, maxChars = 150) {
    if (!biography) return "";
    return biography.length > maxChars ? biography.slice(0, maxChars) + "..." : biography;
  }

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Handcraft Haven</Link>
        <nav className={styles.nav} aria-label="Main Navigation">
          <Link href="/shop" className={styles.navLink}>Shop</Link>
          <Link href="/sellers" className={styles.navLink}>Sellers</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <LoginButton />
        </nav>
      </header>

      <main className={styles.container}>
        <h1 className={styles.sectionTitle}>Featured Sellers</h1>
        <p className={styles.subtitle}>Meet the talented artisans behind Handcraft Haven.</p>

        {loading ? (
          <p>Loading sellers…</p>
        ) : sellers.length === 0 ? (
          <p>No sellers available.</p>
        ) : (
          <div className={styles.sellersGrid}>
            {sellers.map(seller => (
              <Link
                key={seller._id}
                href={`/sellers/${seller._id}`}
                className={styles.sellerCard}
              >
                <div style={{ width: 200, height: 200, position: "relative", margin: "0 auto", marginBottom: "1rem" }}>
                  <Image
                    src={seller.avatar || "/seller-placeholder.jpg"}
                    alt={seller.name}
                    fill
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
                <h3 className={styles.cardTitle}>{seller.name}</h3>
                <p className={styles.cardDesc}>{trimBio(seller.biography || seller.description)}</p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </>
  );
}
