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
  const [error, setError] = useState("");

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
  try {
    setError("");
    console.log("Fetching from:", `${SUPABASE_URL}/rest/v1/products`);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    console.log("Products loaded:", data);
    setProducts(data || []);
  } catch (err: any) {
    console.error("Fetch error:", err);
    setError("Failed to load products: " + err.message);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setForm(prev => ({ ...prev, imagePreview: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = async () => {
    if (!form.name || !form.price || !form.description || !form.imagePreview) {
      alert("Please fill all fields");
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
      const method = editingId ? "PATCH" : "POST";
      const url = editingId 
        ? `${SUPABASE_URL}/rest/v1/products?id=eq.${editingId}` 
        : `${SUPABASE_URL}/rest/v1/products`;

      await fetch(url, {
        method,
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      fetchProducts();
      resetForm();
      alert(editingId ? "Product Updated!" : "Product Added Successfully!");
    } catch (err) {
      alert("Failed to save product. Check console.");
      console.error(err);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      name: "", price: "", category: "Clothes", gender: "Women",
      size: "", color: "", description: "", imagePreview: ""
    });
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
      imagePreview: p.images[0],
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-2">TESSY LUXE</h1>
          <p className="text-center text-gray-600 mb-8">Admin Dashboard</p>
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-6" />
          <Button onClick={() => setIsLoggedIn(password === ADMIN_PASSWORD)} className="w-full py-6">Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => setIsLoggedIn(false)}>Logout</Button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Form */}
      <div className="bg-white p-8 rounded-2xl shadow mb-12">
        <h2 className="text-2xl font-semibold mb-6">{editingId ? "Edit Product" : "Add New Product"}</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Input placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <Input type="number" placeholder="Price (₦)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />

          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="border rounded-xl px-4 py-3">
            <option value="Clothes">Clothes</option>
            <option value="Bags">Bags</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="border rounded-xl px-4 py-3">
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Unisex">Unisex</option>
          </select>

          <Input placeholder="Size" value={form.size} onChange={e => setForm({...form, size: e.target.value})} />
          <Input placeholder="Color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />

          <div className="md:col-span-2">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full" />
            {form.imagePreview && <img src={form.imagePreview} alt="preview" className="mt-4 max-h-60 rounded" />}
          </div>

          <Textarea placeholder="Description" className="md:col-span-2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        <Button onClick={saveProduct} disabled={loading} className="mt-8 w-full py-6">
          {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
        </Button>
      </div>

      <h2 className="text-2xl font-semibold mb-6">All Products ({products.length})</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow border">
            <img src={product.images[0]} alt={product.name} className="w-full h-52 object-cover" />
            <div className="p-5">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-rose-600 font-bold">₦{product.price?.toLocaleString()}</p>
              <div className="flex gap-3 mt-6">
                <Button size="sm" variant="outline" onClick={() => editProduct(product)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => confirm("Delete?") && fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${product.id}`, { method: "DELETE", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }}).then(fetchProducts)}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}