"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "../../landing.module.css";

export default function SellerDashboard() {
  const router = useRouter();
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: ""
  });

  const [products, setProducts] = useState<any[]>([]);
  const [seller, setSeller] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState<any>({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const storedSellerId = localStorage.getItem("sellerId");
    if (!storedSellerId) {
      router.push("/login?redirect=/dashboard");
      return;
    }
    setSellerId(storedSellerId);
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (!sellerId) return;

    fetch(`/api/sellers/${sellerId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSeller(data);
      });

    fetch(`/api/products/seller/${sellerId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProducts(data || []);
      });
  }, [sellerId]);

  useEffect(() => {
    if (!seller) return;
    setProfileForm({
      name: seller.name || "",
      email: seller.email || "",
      biography: seller.biography || "",
      avatar: seller.avatar || ""
    });
  }, [seller]);

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price || 0),
      image: form["image" as keyof typeof form] || formImageDefault(),
      seller: sellerId
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

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      setProducts(prev => prev.filter(p => p._id !== id));
    }
  }

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
    setEditingForm({});
  }

  function startEditing(product: any) {
    setEditingId(product._id);
    setEditingForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image
    });
  }

  function saveEditing(id: string) {
    const updates = {
      name: editingForm.name,
      description: editingForm.description,
      price: Number(editingForm.price),
      image: editingForm.image
    };
    handleUpdate(id, updates);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingForm({});
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>, isAddForm: boolean = true) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (isAddForm) {
        setForm(prev => ({ ...prev, image: base64 }));
      } else {
        setEditingForm((prev: any) => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleProfileImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setProfileForm((prev: any) => ({ ...prev, avatar: base64 }));
    };
    reader.readAsDataURL(file);
  }

  function formImageDefault() {
    return "/product-1.jpg";
  }

  if (isCheckingAuth || !sellerId) return <p style={{ padding: 24 }}>Loading dashboard…</p>;

  if (!seller) return <p style={{ padding: 24 }}>Loading dashboard…</p>;

  return (
    <main className={styles.container} style={{ paddingTop: 24 }}>

      <section className={styles.section}>
        <h1 className={styles.sectionTitle}>Seller Dashboard</h1>
        <p className={styles.subtitle}>You can create, edit, or delete your products from here.</p>

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
            type="file"
            accept="image/*"
            onChange={(e) => handleImageSelect(e, true)}
          />
          <textarea
            className={styles.textarea}
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
          />
          <button className={styles.primaryButton} disabled={loading}>{loading ? "Adding…" : "Add Product"}</button>
        </form>

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
                        value={editingForm.name}
                        className={styles.input}
                        onChange={e => setEditingForm({...editingForm, name: e.target.value})}
                        autoFocus
                      />
                    ) : (
                      product.name
                    )}
                  </h3>

                  <p className={styles.cardDesc}>
                    {editingId === product._id ? (
                      <textarea
                        value={editingForm.description}
                        className={styles.textarea}
                        onChange={e => setEditingForm({...editingForm, description: e.target.value})}
                      />
                    ) : (
                      product.description
                    )}
                  </p>

                  {editingId === product._id && (
                    <div style={{ marginTop: 8 }}>
                      <input
                        type="number"
                        className={styles.input}
                        value={editingForm.price}
                        onChange={e => setEditingForm({...editingForm, price: e.target.value})}
                        placeholder="Price"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageSelect(e, false)}
                        style={{ marginTop: 8 }}
                      />
                    </div>
                  )}

                  <p><strong>${editingId === product._id ? editingForm.price : product.price}</strong></p>

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    {editingId === product._id ? (
                      <>
                        <button className={styles.primaryButton} onClick={() => saveEditing(product._id)}>Save</button>
                        <button className={styles.secondaryButton} onClick={cancelEditing}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className={styles.secondaryButton} onClick={() => startEditing(product)}>Edit</button>
                        <button className={styles.secondaryButton} onClick={() => handleDelete(product._id)}>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} style={{ marginTop: 24 }}>
        <h2 className={styles.sectionTitle}>Your Profile</h2>
        <p className={styles.subtitle}>View and edit your seller profile.</p>

        <div style={{ maxWidth: 700, marginTop: 16 }}>
          {profileMessage && (
            <div style={{ padding: '0.75rem', backgroundColor: '#e8f5e9', color: '#2e7d32', borderRadius: 6, marginBottom: 12 }}>
              {profileMessage}
            </div>
          )}

          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Name</label>
          <input className={styles.input} value={profileForm.name || ''} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />

          <label style={{ display: 'block', marginTop: 12, marginBottom: 8, fontWeight: 'bold' }}>Email (optional)</label>
          <input className={styles.input} value={profileForm.email || ''} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />

          <label style={{ display: 'block', marginTop: 12, marginBottom: 8, fontWeight: 'bold' }}>Biography</label>
          <textarea className={styles.textarea} value={profileForm.biography || ''} onChange={e => setProfileForm({...profileForm, biography: e.target.value})} />

          <label style={{ display: 'block', marginTop: 12, marginBottom: 8, fontWeight: 'bold' }}>Avatar</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input type="file" accept="image/*" onChange={handleProfileImageSelect} />
            {profileForm.avatar && (
              <div style={{ width: 80, height: 80, position: 'relative' }}>
                <Image src={profileForm.avatar} alt={profileForm.name || 'Avatar'} fill style={{ objectFit: 'cover', borderRadius: 6 }} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className={styles.primaryButton} disabled={profileLoading} onClick={async () => {
              setProfileLoading(true);
              setProfileMessage(null);
              try {
                const res = await fetch(`/api/sellers/${sellerId}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(profileForm)
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Could not update profile');
                setSeller(data);
                setProfileMessage('Profile updated successfully');
              } catch (err: any) {
                setProfileMessage(err.message || 'Update failed');
              } finally {
                setProfileLoading(false);
              }
            }}>{profileLoading ? 'Saving…' : 'Save Profile'}</button>

            <button className={styles.secondaryButton} onClick={() => {
              setProfileForm({
                name: seller.name || '',
                email: seller.email || '',
                biography: seller.biography || '',
                avatar: seller.avatar || ''
              });
              setProfileMessage(null);
            }}>Reset</button>
          </div>

          <div style={{ marginTop: 24 }}>
            {products.length > 0 ? (
              <div style={{ padding: 12, backgroundColor: '#fff3e0', color: '#bf360c', borderRadius: 6 }}>
                You must delete all your products before you can remove your account. Delete your products first.
              </div>
            ) : (
              <div>
                <button
                  className={styles.secondaryButton}
                  style={{ backgroundColor: '#c62828', color: '#fff', border: 'none' }}
                  disabled={deleteLoading}
                  onClick={async () => {
                    if (products.length > 0) {
                      alert('Please delete your products first.');
                      return;
                    }
                    const ok = confirm('Are you sure you want to permanently delete your account? This cannot be undone.');
                    if (!ok) return;
                    setDeleteLoading(true);
                    try {
                      const res = await fetch(`/api/sellers/${sellerId}`, { method: 'DELETE' });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || 'Could not delete account');
                      localStorage.removeItem('sellerId');
                      localStorage.removeItem('redirectAfterLogin');
                      router.push('/');
                    } catch (err: any) {
                      alert(err.message || 'Delete failed');
                    } finally {
                      setDeleteLoading(false);
                    }
                  }}
                >{deleteLoading ? 'Deleting…' : 'Delete Account'}</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}