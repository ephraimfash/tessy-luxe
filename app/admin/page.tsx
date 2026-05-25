"use client";

import { useState, useEffect } from "react";
import { Product } from "@/app/data/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ADMIN_PASSWORD = "tessy2026";

const commonSizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size", "36", "37", "38", "39", "40", "41", "42", "43", "44"];

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Clothes" as "Clothes" | "Bags" | "Shoes" | "Accessories",
    gender: "Women" as "Men" | "Women" | "Unisex",
    size: "",
    color: "",
    description: "",
    imagePreview: "",
  });

  // Load products
  useEffect(() => {
    const saved = localStorage.getItem("tessyLuxeProducts");
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      import("@/app/data/products").then(({ products: initial }) => {
        setProducts(initial);
      });
    }
  }, []);

  // Auto save
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("tessyLuxeProducts", JSON.stringify(products));
    }
  }, [products]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setForm(prev => ({ ...prev, imagePreview: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addOrUpdate = () => {
    if (!form.name || !form.price || !form.description || !form.imagePreview) {
      alert("Please fill all required fields!");
      return;
    }

    const newProduct: Product = {
      id: editingId || Date.now().toString(),
      name: form.name,
      price: parseInt(form.price),
      category: form.category,
      gender: form.gender,
      size: form.size || undefined,
      color: form.color || undefined,
      description: form.description,
      images: [form.imagePreview],
    };

    if (editingId) {
      setProducts(products.map(p => p.id === editingId ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }

    resetForm();
    alert(editingId ? "Product Updated Successfully!" : "Product Added Successfully!");
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

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-4xl font-bold text-center mb-2">TESSY LUXE</h1>
          <p className="text-center text-gray-600 mb-8">Admin Login</p>
          <Input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-6"
          />
          <Button onClick={() => password === ADMIN_PASSWORD ? setIsLoggedIn(true) : alert("Incorrect Password!")} className="w-full py-6 text-lg">
            Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
          Logout
        </Button>
      </div>

      {/* Form */}
      <div className="bg-white p-8 rounded-2xl shadow mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input type="number" placeholder="Price (₦)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />

          <select 
            value={form.category} 
            onChange={(e) => setForm({ ...form, category: e.target.value as any })}
            className="border rounded-lg px-4 py-3"
          >
            <option value="Clothes">Clothes</option>
            <option value="Bags">Bags</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select 
            value={form.gender} 
            onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
            className="border rounded-lg px-4 py-3"
          >
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Unisex">Unisex</option>
          </select>

          <select 
            value={form.size} 
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            className="border rounded-lg px-4 py-3"
          >
            <option value="">Select Size</option>
            {commonSizes.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>

          <Input placeholder="Color (e.g. Black, Gold)" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Product Image</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-rose-600 file:text-white hover:file:bg-rose-700"
            />
            {form.imagePreview && (
              <img src={form.imagePreview} alt="Preview" className="mt-4 max-h-60 rounded-lg" />
            )}
          </div>

          <Textarea 
            placeholder="Product Description" 
            className="md:col-span-2" 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
          />
        </div>

        <div className="flex gap-4 mt-8">
          <Button onClick={addOrUpdate} className="flex-1">
            {editingId ? "Update Product" : "Add Product"}
          </Button>
          {editingId && <Button variant="outline" onClick={resetForm}>Cancel</Button>}
        </div>
      </div>

      {/* Products List */}
      <h2 className="text-2xl font-semibold mb-6">All Products ({products.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow border">
            <img src={product.images[0]} alt={product.name} className="w-full h-52 object-cover" />
            <div className="p-5">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-rose-600 font-bold">₦{product.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{product.category} • {product.gender}</p>

              <div className="flex gap-3 mt-6">
                <Button size="sm" variant="outline" onClick={() => editProduct(product)}>
                  Edit
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => confirm("Delete this product?") && setProducts(products.filter(p => p.id !== product.id))}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}