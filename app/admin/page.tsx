"use client";

import { useState, useEffect } from "react";
import { Product } from "@/app/data/products";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ADMIN_PASSWORD = "tessy2026";

const commonSizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "One Size",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
];

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Clothes",
    gender: "Women",
    size: "",
    color: "",
    description: "",
    imagePreview: "",
  });

  // FETCH PRODUCTS FROM SUPABASE
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch Error:", error);
    } else {
      setProducts(data || []);
    }
  };

  // IMAGE UPLOAD
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setForm((prev) => ({
          ...prev,
          imagePreview: event.target?.result as string,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  // SAVE PRODUCT
  const saveProduct = async () => {
    if (
      !form.name ||
      !form.price ||
      !form.description ||
      !form.imagePreview
    ) {
      alert("Please fill all fields");
      return;
    }

    const productData = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      gender: form.gender,
      size: form.size || null,
      color: form.color || null,
      description: form.description,
      images: [form.imagePreview],
    };

    // UPDATE PRODUCT
    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingId);

      if (error) {
        console.error(error);
        alert("Failed to update product");
        return;
      }

      alert("Product Updated!");
    }

    // ADD PRODUCT
    else {
      const { error } = await supabase
        .from("products")
        .insert([productData]);

      if (error) {
        console.error(error);
        alert("Failed to save product");
        return;
      }

      alert("Product Added!");
    }

    fetchProducts();
    resetForm();
  };

  // DELETE PRODUCT
  const deleteProduct = async (id: number) => {
    const confirmDelete = confirm("Delete this product?");

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Failed to delete product");
      return;
    }

    fetchProducts();
  };

  // RESET FORM
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      category: "Clothes",
      gender: "Women",
      size: "",
      color: "",
      description: "",
      imagePreview: "",
    });

    setEditingId(null);
  };

  // EDIT PRODUCT
  const editProduct = (p: any) => {
    setEditingId(p.id);

    setForm({
      name: p.name,
      price: p.price.toString(),
      category: p.category,
      gender: p.gender,
      size: p.size || "",
      color: p.color || "",
      description: p.description,
      imagePreview: p.images?.[0] || "",
    });
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-2">
            TESSY LUXE
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Admin Dashboard
          </p>

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="mb-6"
          />

          <Button
            onClick={() =>
              setIsLoggedIn(password === ADMIN_PASSWORD)
            }
            className="w-full py-6"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  // MAIN UI
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <Button
          variant="outline"
          onClick={() => setIsLoggedIn(false)}
        >
          Logout
        </Button>
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-2xl shadow mb-12">

        <h2 className="text-2xl font-semibold mb-6">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <Input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <Input
            type="number"
            placeholder="Price (₦)"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
          />

          {/* CATEGORY */}
          <select
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3"
          >
            <option value="Clothes">Clothes</option>
            <option value="Bags">Bags</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>

          {/* GENDER */}
          <select
            value={form.gender}
            onChange={(e) =>
              setForm({
                ...form,
                gender: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3"
          >
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Unisex">Unisex</option>
          </select>

          {/* SIZE */}
          <select
            value={form.size}
            onChange={(e) =>
              setForm({
                ...form,
                size: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3"
          >
            <option value="">Select Size</option>

            {commonSizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* COLOR */}
          <Input
            placeholder="Color"
            value={form.color}
            onChange={(e) =>
              setForm({
                ...form,
                color: e.target.value,
              })
            }
          />

          {/* IMAGE */}
          <div className="md:col-span-2">
            <label className="block mb-2">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full"
            />

            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="preview"
                className="mt-4 max-h-60 rounded-lg"
              />
            )}
          </div>

          {/* DESCRIPTION */}
          <Textarea
            placeholder="Description"
            className="md:col-span-2"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

        </div>

        <Button
          onClick={saveProduct}
          className="mt-8 w-full py-6"
        >
          {editingId ? "Update Product" : "Add Product"}
        </Button>
      </div>

      {/* PRODUCTS */}
      <h2 className="text-2xl font-semibold mb-6">
        All Products ({products.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map((product: any) => (

          <div
            key={product.id}
            className="bg-white rounded-2xl overflow-hidden shadow border"
          >

            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">

              <h3 className="font-semibold">
                {product.name}
              </h3>

              <p className="text-rose-600 font-bold">
                ₦{Number(product.price).toLocaleString()}
              </p>

              <p className="text-sm text-gray-500">
                {product.category} • {product.gender}
              </p>

              <div className="flex gap-3 mt-6">

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => editProduct(product)}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteProduct(product.id)}
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