"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "../../landing.module.css";

export default function ProductDetail({ params }: any) {
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const id = (await params).id;

      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);

      // Load related items except this one
      fetch("/api/products")
        .then(r => r.json())
        .then(all =>
          setRelated(all.filter((p: any) => p._id !== id).slice(0, 3))
        );
    }

    load();
  }, [params]);

  if (!product) return <p>Loading...</p>;

  return (
    <>
      {/* Navigation */}
      <header className={styles.header}>
        <div className={styles.logo}>Handcraft Haven</div>
        <nav className={styles.nav}>
          <Link href="/shop" className={styles.navLink}>Shop</Link>
          <Link href="/sellers" className={styles.navLink}>Sellers</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <button className={styles.loginButton}>Log In</button>
        </nav>
      </header>

      <main className={styles.container}>
        <div className={styles.productDetail}>
          <Image
            src={product.image || "/placeholder.png"}
            alt={product.title}
            width={500}
            height={400}
            className={styles.detailImage}
          />

          <div className={styles.detailInfo}>
            <h1 className={styles.sectionTitle}>{product.title}</h1>
            <p className={styles.subtitle}>${product.price}</p>
            <p>{product.description}</p>

            <h3>Seller:</h3>
            <p>{product.seller?.name || "Unknown seller"}</p>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Related Items</h2>

          <div className={styles.productsGrid}>
            {related.map(p => (
              <Link
                key={p._id}
                href={`/product/${p._id}`}
                className={styles.productCard}
              >
                <Image
                  src={p.image || "/placeholder.png"}
                  width={300}
                  height={200}
                  alt={p.title}
                  className={styles.cardImage}
                />
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardDesc}>${p.price}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </>
  );
}