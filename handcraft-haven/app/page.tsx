"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./landing.module.css";
import LoginButtonClient from "./components/LoginButtonClient";

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [featuredSellers, setFeaturedSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [pRes, sRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/sellers")
        ]);

        const products = pRes.ok ? await pRes.json() : [];
        const sellers = sRes.ok ? await sRes.json() : [];

        if (!mounted) return;

        setFeaturedProducts(Array.isArray(products) ? [...products].sort(() => Math.random() - 0.5).slice(0, 3) : []);
        setFeaturedSellers(Array.isArray(sellers) ? [...sellers].sort(() => Math.random() - 0.5).slice(0, 2) : []);
      } catch (err) {
        console.error("Landing fetch error:", err);
        if (mounted) {
          setFeaturedProducts([]);
          setFeaturedSellers([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, []);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Handcraft Haven</Link>
        <nav className={styles.nav} aria-label="Main Navigation">
          <Link href="/shop" className={styles.navLink}>Shop</Link>
          <Link href="/sellers" className={styles.navLink}>Sellers</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <LoginButtonClient />
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.title}>Handcraft Haven</h1>
        <p className={styles.subtitle}>Discover unique handcrafted items from talented artisans around the world.</p>
        <Link href="/shop" className={styles.primaryButton}>Shop Products</Link>
        <div className={styles.heroImageWrapper}>
          <Image
            src="/hero.jpg"
            alt="Handcrafted items arranged aesthetically"
            width={1200}
            height={600}
            className={styles.heroImage}
          />
        </div>
      </section>

      <section className={styles.section}>
  <h2 className={styles.sectionTitle}>Featured Products</h2>

  <div className={styles.productsGrid}>
    {loading ? (
      <p>Loading products…</p>
    ) : featuredProducts.length > 0 ? (
      featuredProducts.map((product: any) => (
        <Link href={`/product/${product._id}`} key={product._id} className={styles.productCard}>
          <Image
            src={product.image || "/product-1.jpg"}
            alt={product.name || product.title || "Product image"}
            width={300}
            height={200}
            className={styles.cardImage}
          />
          <h3 className={styles.cardTitle}>{product.name || product.title}</h3>
          <p className={styles.cardDesc}>
            {product.description || "A beautifully handcrafted piece made with care."}
          </p>
        </Link>
      ))
    ) : (
      <p>No products available.</p>
    )}
  </div>
</section>

      <section className={styles.section}>
  <h2 className={styles.sectionTitle}>About Us</h2>

  <div className={styles.aboutUs}>
    <p className={styles.aboutText}>
      Handcraft Haven is a platform dedicated to supporting artisans and
      connecting them with customers who appreciate genuine craftsmanship.
    </p>

    <div className={styles.aboutImageWrapper}>
      <Image
        src="/about-us.jpg"
        alt="Handcrafting artisanal work"
        width={500}
        height={400}
        className={styles.aboutImage}
      />
    </div>
  </div>

    <div className={styles.buttonsRow}>
    <Link href="/signup" className={styles.secondaryButton}>Sign Up</Link>
    <LoginButtonClient />
  </div>
</section>


      <section className={styles.section}>
  <h2 className={styles.sectionTitle}>Featured Sellers</h2>

  <div className={styles.sellersGrid}>
    {loading ? (
      <p>Loading sellers…</p>
    ) : featuredSellers.length > 0 ? (
      featuredSellers.map((seller: any) => (
        <Link href={`/sellers/${seller._id}`} key={seller._id} className={styles.sellerCard}>
          <Image
            src={seller.avatar || "/seller-1.jpg"}
            alt={seller.name || "Seller avatar"}
            width={200}
            height={200}
            className={styles.sellerImage}
          />
          <h3 className={styles.cardTitle}>{seller.name}</h3>
          <p className={styles.cardDesc}>
            {seller.biography || "An artisan known for unique handcrafted work."}
          </p>
        </Link>
      ))
    ) : (
      <p>No sellers available.</p>
    )}
  </div>
</section>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </main>
  );
}
