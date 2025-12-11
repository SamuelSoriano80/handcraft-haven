"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoginButton from "../../components/LoginButton";
import styles from "../../landing.module.css";

export default function ProductDetail({ params }: any) {
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);

  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  const [form, setForm] = useState({ name: "", rating: 5, description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const id = (await params).id;

      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);

      if (data.seller) {
        fetch(`/api/sellers/${data.seller}`)
          .then(r => r.json())
          .then(sellerData => {
            if (!sellerData.error) setSeller(sellerData);
          });
      }

      // Load related items except this one and fetch their seller names
      fetch("/api/products")
        .then(r => r.json())
        .then(async all => {
          const relatedFiltered = all.filter((p: any) => p._id !== id).slice(0, 3);

          const enrichedRelated = await Promise.all(
            relatedFiltered.map(async (p: any) => {
              if (p.seller) {
                try {
                  const sellerRes = await fetch(`/api/sellers/${p.seller}`);
                  const sellerData = await sellerRes.json();
                  if (!sellerData.error) {
                    return { ...p, seller: sellerData };
                  }
                } catch (err) {
                  console.error("Error fetching seller:", err);
                }
              }
              return p;
            })
          );

          setRelated(enrichedRelated);
        });

      fetch(`/api/reviews/product/${id}`)
        .then(r => r.json())
        .then(list => {
          if (!list.error) {
            setReviews(list);
            if (Array.isArray(list) && list.length > 0) {
              const avg = list.reduce((s: number, r: any) => s + (r.rating || 0), 0) / list.length;
              setAvgRating(Number(avg.toFixed(2)));
            } else {
              setAvgRating(null);
            }
          }
        })
        .catch(err => console.error("Error loading reviews:", err));
    }

    load();
  }, [params]);

  if (!product) return <p>Loading...</p>;

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!form.description.trim()) return alert("Please enter a review description.");

    setSubmitting(true);
    try {
      const id = (await params).id;
      const res = await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          name: form.name,
          description: form.description,
          rating: Number(form.rating)
        })
      });
      const created = await res.json();
      if (created.error) {
        alert(created.error || "Failed to add review");
      } else {
        setReviews(prev => [created, ...prev]);
        setAvgRating(prev => {
          const all = [created, ...reviews];
          const avg = all.reduce((s: number, r: any) => s + (r.rating || 0), 0) / all.length;
          return Number(avg.toFixed(2));
        });
        setForm({ name: "", rating: 5, description: "" });
      }
    } catch (err) {
      console.error("Submit review error:", err);
      alert("Server error while submitting review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>Handcraft Haven</Link>
        <nav className={styles.nav}>
          <Link href="/shop" className={styles.navLink}>Shop</Link>
          <Link href="/sellers" className={styles.navLink}>Sellers</Link>
          <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          <LoginButton />
        </nav>
      </header>

      <main className={styles.container}>
        <div className={styles.productDetail}>
          <Image
            src={product.image || "/product-1.png"}
            alt={product.title || product.name || "Product image"}
            width={500}
            height={400}
            className={styles.detailImage}
          />

          <div className={styles.detailInfo}>
            <h1 className={styles.sectionTitle} style={{ marginTop: 0, textAlign: "left" }}>{product.title || product.name}</h1>
            <p style={{ fontSize: "0.95rem", color: "#666", marginBottom: "1rem", textAlign: "left" }}>
              by <strong>{seller?.name || product.seller?.name || "Unknown seller"}</strong>
            </p>
            <p className={styles.subtitle} style={{ textAlign: "left" }}>${product.price}</p>
            <p style={{ textAlign: "left", lineHeight: 1.6, marginBottom: "1.5rem" }}>{product.description}</p>

            <button className={styles.primaryButton} style={{ marginRight: "1rem" }}>Buy Now</button>
            <button className={styles.secondaryButton}>Add to Cart</button>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Latest Reviews {avgRating ? ` — Avg: ${avgRating}/5` : ""}</h2>

          {reviews.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999" }}>No reviews yet. Be the first to review this product!</p>
          ) : (
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              {reviews.map(r => (
                <div key={r._id} style={{ borderBottom: "1px solid #eee", padding: "0.75rem 0" }}>
                  <p style={{ margin: 0 }}><strong>{r.name}</strong> — <span style={{ color: "#f39c12" }}>{r.rating}/5</span></p>
                  <p style={{ margin: "0.25rem 0 0", color: "#444" }}>{r.description}</p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "#888" }}>{new Date(r.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ maxWidth: 700, margin: "1rem auto 0", display: "grid", gap: "0.5rem" }}>
            <input
              placeholder="Your name (optional)"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className={styles.input}
            />

            <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))} className={styles.input}>
              <option value={5}>5 — Excellent</option>
              <option value={4}>4 — Very good</option>
              <option value={3}>3 — Good</option>
              <option value={2}>2 — Fair</option>
              <option value={1}>1 — Poor</option>
            </select>

            <textarea
              placeholder="Write your review"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className={styles.textarea}
              rows={4}
            />

            <div>
              <button type="submit" className={styles.primaryButton} disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </form>
        </section>

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
                  alt={p.title || p.name || "Product image"}
                  className={styles.cardImage}
                />
                <h3 className={styles.cardTitle}>{p.title || p.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}>
                  by {p.seller?.name || "Unknown seller"}
                </p>
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