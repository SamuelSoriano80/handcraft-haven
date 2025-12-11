"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import LoginButton from "../../components/LoginButton";
import styles from "../../landing.module.css";

export default function SellerDetailPage() {
  const params = useParams();
  const sellerId = params.id as string;

  const [seller, setSeller] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) return;

    Promise.all([
      fetch(`/api/sellers/${sellerId}`).then(res => res.json()),
      fetch(`/api/products/seller/${sellerId}`).then(res => res.json())
    ]).then(([sellerData, productsData]) => {
      if (!sellerData.error) setSeller(sellerData);
      if (Array.isArray(productsData)) setProducts(productsData);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching seller data:", err);
      setLoading(false);
    });
  }, [sellerId]);

  if (loading) {
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
          <p>Loading seller…</p>
        </main>
      </>
    );
  }

  if (!seller) {
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
          <p>Seller not found.</p>
        </main>
      </>
    );
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
        <section className={styles.section}>
          <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: 250, height: 250, position: "relative", borderRadius: 8, overflow: "hidden" }}>
                <Image
                  src={seller.avatar || "/seller-placeholder.jpg"}
                  alt={seller.name}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              <h1 className={styles.sectionTitle} style={{ textAlign: "left", marginTop: 0 }}>{seller.name}</h1>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                {seller.biography || seller.description || "No biography available."}
              </p>
              {seller.email && (
                <p>
                  <strong>Contact:</strong> <a href={`mailto:${seller.email}`} style={{ color: "#000", textDecoration: "underline" }}>{seller.email}</a>
                </p>
              )}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Products by {seller.name}</h2>

          {products.length === 0 ? (
            <p>No products available from this seller.</p>
          ) : (
            <div className={styles.productsGrid}>
              {products.map(product => (
                <Link
                  key={product._id}
                  href={`/product/${product._id}`}
                  className={styles.productCard}
                >
                  <Image
                    src={product.image || "/product-placeholder.jpg"}
                    width={300}
                    height={200}
                    alt={product.title || product.name || "Product image"}
                    className={styles.cardImage}
                  />
                  <h3 className={styles.cardTitle}>{product.title || product.name}</h3>
                  <p className={styles.cardDesc}>${product.price || "N/A"}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </>
  );
}
