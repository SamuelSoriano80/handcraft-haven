import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./landing.module.css";

export default function LandingPage() {
  return (
    <main className={styles.container}>
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

      {/* Featured Products */}
      <section className={styles.section}>
  <h2 className={styles.sectionTitle}>Featured Products</h2>

  <div className={styles.productsGrid}>
    {[1, 2, 3].map((i) => (
      <Link href={`/product/${i}`} key={i} className={styles.productCard}>
        <Image
          src={`/product-${i}.jpg`}
          alt={`Featured handcrafted product ${i}`}
          width={300}
          height={200}
          className={styles.cardImage}
        />
        <h3 className={styles.cardTitle}>Product {i}</h3>
        <p className={styles.cardDesc}>
          A beautifully handcrafted piece made with care.
        </p>
      </Link>
    ))}
  </div>
</section>


      {/* About Us */}
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
    <Link href="/login" className={styles.primaryButton}>Log In</Link>
  </div>
</section>


      {/* Featured Sellers */}
      <section className={styles.section}>
  <h2 className={styles.sectionTitle}>Featured Sellers</h2>

  <div className={styles.sellersGrid}>
    {[1, 2].map((i) => (
      <div key={i} className={styles.sellerCard}>
        <Image
          src={`/seller-${i}.jpg`}
          alt={`Featured seller ${i}`}
          width={200}
          height={200}
          className={styles.sellerImage}
        />
        <h3 className={styles.cardTitle}>Seller {i}</h3>
        <p className={styles.cardDesc}>
          An artisan known for unique handcrafted work.
        </p>
      </div>
    ))}
  </div>
</section>


      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Handcraft Haven. All rights reserved.</p>
      </footer>
    </main>
  );
}
