"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../../landing.module.css";

const SELLER_ID = "692b676705ef5fc618cae7a7";

export default function SellerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [seller, setSeller] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/sellers/${SELLER_ID}`)
      .then(res => res.json())
      .then(setSeller);

    fetch(`/api/products/seller/${SELLER_ID}`)
      .then(res => res.json())
      .then(setProducts);
  }, []);

  return (
    <section className={styles.section}>
      <h1 className={styles.sectionTitle}>Seller Dashboard</h1>
      <p className={styles.subtitle}>
        You can create, edit, or delete your products from here.
      </p>

      {/* Add product button */}
      <div style={{ margin: "2rem 0" }}>
        <button className={styles.primaryButton}>
          + Add New Product
        </button>
      </div>

      {/* Products */}
      <div className={styles.productsGrid}>
        {products.length === 0 && (
          <p>No products yet.</p>
        )}

        {products.map(product => (
          <div key={product._id} className={styles.productCard}>
            <Image
              src={product.image || "/placeholder.png"}
              alt={product.title}
              width={300}
              height={200}
              className={styles.cardImage}
            />

            <h3 className={styles.cardTitle}>{product.title}</h3>
            <p className={styles.cardDesc}>{product.description}</p>
            <p><strong>${product.price}</strong></p>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button className={styles.secondaryButton}>Edit</button>
              <button className={styles.secondaryButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
