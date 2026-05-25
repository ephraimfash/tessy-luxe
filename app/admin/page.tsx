"use client";

import { useState, useEffect } from "react";
import { Product } from "@/app/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit2, LogOut, Upload } from "lucide-react";

const ADMIN_PASSWORD = "tessy2026";

const SUPABASE_URL = "https://rexntutqfjubyegspskd.supabase.co";
const SUPABASE_KEY = "sb_publishable_v1V9zDrhd25C80zqFGOHNw_JxLbgAmd";

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Clothes" as any,
    gender: "Women" as any,
    size: "",
    color: "",
    description: "",
    imagePreview: "",
  });

  const fetchProducts = async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(prev => ({...prev, imagePreview: ev.target?.result as string}));
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = async () => {
    if (!form.name || !form.price || !form.description || !form.imagePreview) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    const payload = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      gender: form.gender,
      size: form.size || null,
      color: form.color || null,
      description: form.description,
      images: [form.imagePreview]
    };

    try {
      if (editingId) {
        await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${editingId}`, {
          method: "PATCH",
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/products`, {
          method: "POST",
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      fetchProducts();
      resetForm();
      alert(editingId ? "Updated!" : "Product Added!");
    } catch (err) {
      alert("Failed to save");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ name: "", price: "", category: "Clothes", gender: "Women", size: "", color: "", description: "", imagePreview: "" });
    setEditingId(null);
  };

  const editProduct = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: p.price.toString(),
      category: p.category,
      gender: p.gender,
      size: p.size || "",
      color: p.color || "",
      description: p.description,
      imagePreview: p.images[0]
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-6">TESSY LUXE</h1>
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-6" />
          <Button onClick={() => setIsLoggedIn(password === ADMIN_PASSWORD)} className="w-full py-6">Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between mb-10">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => setIsLoggedIn(false)}>Logout</Button>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white p-8 rounded-2xl shadow mb-12">
        <h2 className="text-2xl font-semibold mb-6">{editingId ? "Edit Product" : "Add New Product"}</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Input placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <Input type="number" placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />

          <select value={form.category} onChange={e => setForm({...form, category: e.target.value as any})} className="border p-3 rounded-xl">
            <option value="Clothes">Clothes</option>
            <option value="Bags">Bags</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value as any})} className="border p-3 rounded-xl">
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Unisex">Unisex</option>
          </select>

          <Input placeholder="Size" value={form.size} onChange={e => setForm({...form, size: e.target.value})} />
          <Input placeholder="Color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />

          <div className="md:col-span-2">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {form.imagePreview && <img src={form.imagePreview} className="mt-4 h-48" />}
          </div>

          <Textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="md:col-span-2" />
        </div>

        <Button onClick={saveProduct} disabled={loading} className="mt-6 w-full">
          {loading ? "Saving..." : editingId ? "Update" : "Add Product"}
        </Button>
      </div>

      {/* Products List */}
      <h2 className="text-2xl font-semibold mb-6">All Products ({products.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="border rounded-2xl overflow-hidden">
            <img src={p.images[0]} className="w-full h-52 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-rose-600 font-bold">₦{p.price.toLocaleString()}</p>
              <div className="flex gap-3 mt-4">
                <Button size="sm" onClick={() => editProduct(p)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => confirm("Delete?") && fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${p.id}`, { method: "DELETE", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }}).then(fetchProducts)}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}