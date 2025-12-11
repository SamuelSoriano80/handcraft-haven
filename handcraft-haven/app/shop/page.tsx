"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "../components/LoginButton";
import styles from "../landing.module.css";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState<string>("All");
  const [sellerFilter, setSellerFilter] = useState<string>("All");

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFiltered(data);
      });
    // fetch sellers for seller filter
    fetch("/api/sellers")
      .then(res => res.json())
      .then(data => setSellers(Array.isArray(data) ? data : []))
      .catch(() => setSellers([]));
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFiltered(
      products.filter(p => {
        const title = (p.title || p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();

        // search match
        if (!(title.includes(lower) || desc.includes(lower))) return false;

        // seller filter
        if (sellerFilter && sellerFilter !== "All") {
          if (!p.seller || String(p.seller) !== String(sellerFilter)) return false;
        }

        // price filter
        const price = Number(p.price || 0);
        switch (priceRange) {
          case "Under $25":
            if (!(price < 25)) return false;
            break;
          case "$25 - $50":
            if (!(price >= 25 && price <= 50)) return false;
            break;
          case "$50 - $100":
            if (!(price > 50 && price <= 100)) return false;
            break;
          case "$100+":
            if (!(price > 100)) return false;
            break;
          default:
            break;
        }

        return true;
      })
    );
  }, [search, products, priceRange, sellerFilter]);

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
          <aside className={styles.filters}>
            <h3>Filters</h3>

            <label className={styles.filterLabel}>Price Range</label>
            <select
              className={styles.filterSelect}
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Under $25">Under $25</option>
              <option value="$25 - $50">$25 - $50</option>
              <option value="$50 - $100">$50 - $100</option>
              <option value="$100+">$100+</option>
            </select>

            <label className={styles.filterLabel}>Seller</label>
            <select
              className={styles.filterSelect}
              value={sellerFilter}
              onChange={e => setSellerFilter(e.target.value)}
            >
              <option value="All">All Sellers</option>
              {sellers.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </aside>

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

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </>
  );
}
