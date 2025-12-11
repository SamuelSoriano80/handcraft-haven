"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../landing.module.css";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFiltered(data);
      });
  }, []);

  // Filter by search
  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      products.filter(p => {
        const title = (p.title || p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return title.includes(lower) || desc.includes(lower);
      })
    );
  }, [search, products]);

  return (
    <>
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

      <main className={styles.container}>
        <h1 className={styles.sectionTitle}>Shop</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchBar}
        />

        <div className={styles.shopLayout}>
          {/* Filters */}
          <aside className={styles.filters}>
            <h3>Filters</h3>

            <label className={styles.filterLabel}>Price Range</label>
            <select className={styles.filterSelect}>
              <option>All</option>
              <option>Under $25</option>
              <option>$25 - $50</option>
              <option>$50 - $100</option>
              <option>$100+</option>
            </select>

            <label className={styles.filterLabel}>Seller</label>
            <select className={styles.filterSelect}>
              <option>All Sellers</option>
            </select>
          </aside>

          {/* Product Grid */}
          <div className={styles.productsGrid}>
            {filtered.map(product => (
              <Link
                key={product._id}
                href={`/product/${product._id}`}
                className={styles.productCard}
              >
                <Image
                  src={product.image || "/product-1.png"}
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
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </>
  );
}
