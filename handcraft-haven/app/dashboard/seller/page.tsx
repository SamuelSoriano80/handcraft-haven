"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../../landing.module.css";

const SELLER_ID = "692b676705ef5fc618cae7a7";

export default function SellerDashboard() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: ""
  });

  const [products, setProducts] = useState<any[]>([]);
  const [seller, setSeller] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/sellers/${SELLER_ID}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSeller(data);
      });

    fetch(`/api/products/seller/${SELLER_ID}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProducts(data || []);
      });
  }, []);

  // Add product - must send 'name' to match Product model
  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // prepare payload - match Mongoose schema keys (name, description, price, image, seller)
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price || 0),
      image: formImageDefault(), // replace with an uploader later
      seller: SELLER_ID
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const newProduct = await res.json();

    if (res.ok) {
      setProducts(prev => [...prev, newProduct]);
      setForm({ name: "", description: "", price: "" });
    } else {
      console.error("Add product error:", newProduct);
      alert(newProduct.error || "Could not add product");
    }

    setLoading(false);
  }

  // Delete product
  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setProducts(prev => prev.filter(p => p._id !== id));
    }
  }

  // Update single field or entire object
  async function handleUpdate(id: string, updates: Record<string, any>) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Update failed");
      return;
    }

    const updated = await res.json();
    setProducts(prev => prev.map(p => (p._id === id ? updated : p)));
    setEditingId(null);
  }

  function formImageDefault() {
    // return a sensible default image path from /public
    return "/product-1.jpg";
  }

  if (!seller) return <p style={{ padding: 24 }}>Loading dashboard…</p>;

  return (
    <main className={styles.container} style={{ paddingTop: 24 }}>

      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Seller Dashboard</h1>
        <p className={styles.subtitle}>You can create, edit, or delete your products from here.</p>

        {/* Add product form */}
        <form onSubmit={handleAddProduct} style={{ display: "flex", gap: 12, alignItems: "center", margin: "2rem 0", flexWrap: "wrap" }}>
          <input
            className={styles.input}
            placeholder="Title"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            required
          />
          <input
            className={styles.input}
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={e => setForm({...form, price: e.target.value})}
            required
          />
          <input
            className={styles.input}
            placeholder="Image (optional)"
            value={form["image" as keyof typeof form] || ""}
            onChange={e => setForm({...form, /* keep image in form if you want */})}
            style={{ display: "none" }}
          />
          <textarea
            className={styles.textarea}
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
          />
          <button className={styles.primaryButton} disabled={loading}>{loading ? "Adding…" : "Add Product"}</button>
        </form>

        {/* Products grid */}
        <div className={styles.productsGrid}>
          {products.length === 0 && <p>No products yet.</p>}

          {products.map(product => (
            <article key={product._id} className={styles.productCard} aria-labelledby={`p-${product._id}`}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 120, height: 120, position: "relative", flexShrink: 0 }}>
                  <Image src={product.image || formImageDefault()} alt={product.name || "Product image"} fill style={{ objectFit: "cover", borderRadius: 6 }} />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 id={`p-${product._id}`} className={styles.cardTitle}>
                    {editingId === product._id ? (
                      <input
                        defaultValue={product.name}
                        className={styles.input}
                        onBlur={e => handleUpdate(product._id, { name: e.target.value })}
                        autoFocus
                      />
                    ) : (
                      product.name
                    )}
                  </h3>

                  <p className={styles.cardDesc}>
                    {editingId === product._id ? (
                      <textarea
                        defaultValue={product.description}
                        className={styles.textarea}
                        onBlur={e => handleUpdate(product._id, { description: e.target.value })}
                      />
                    ) : (
                      product.description
                    )}
                  </p>

                  <p><strong>${product.price}</strong></p>

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className={styles.secondaryButton} onClick={() => setEditingId(product._id)}>Edit</button>
                    <button className={styles.secondaryButton} onClick={() => handleDelete(product._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}