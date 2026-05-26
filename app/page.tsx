"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SUPABASE_URL = "https://rexntutqfjubyegspskd.supabase.co";
const SUPABASE_KEY = "sb_publishable_v1V9zDrhd25C80zqFGOHNw_JxLbgAmd";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p: any) => {
    const matchSearch = search === "" || 
      p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <>
      <section className="bg-gradient-to-br from-rose-50 via-white to-amber-50 pt-24 pb-16 text-center">
        <h1 className="text-6xl md:text-7xl font-bold">TESSY <span className="text-rose-600">LUXE</span></h1>
        <p className="text-2xl mt-4">“Dress Beautiful, Feel Confident.”</p>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8 border-b bg-white sticky top-0 z-40">
        <div className="flex flex-wrap gap-4">
          <Input 
            placeholder="Search products..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="max-w-sm"
          />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)} 
            className="border rounded-xl px-4 py-3"
          >
            <option value="All">All Categories</option>
            <option value="Clothes">Clothes</option>
            <option value="Bags">Bags</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-8">Our Collection ({filteredProducts.length})</h2>

        {filteredProducts.length === 0 ? (
          <p className="text-center py-20 text-xl text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}