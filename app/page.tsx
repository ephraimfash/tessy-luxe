"use client";

import { useState, useEffect } from "react";
import { Product } from "./data/products";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");

  // Load products
  useEffect(() => {
    const saved = localStorage.getItem("tessyLuxeProducts");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAllProducts(parsed);
      setFilteredProducts(parsed);
    } else {
      import("./data/products").then(({ products: initial }) => {
        setAllProducts(initial);
        setFilteredProducts(initial);
      });
    }
  }, []);

  // Filtering
  useEffect(() => {
    let result = [...allProducts];

    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (genderFilter !== "All") {
      result = result.filter(p => p.gender === genderFilter);
    }
    if (sizeFilter !== "All") {
      result = result.filter(p => p.size === sizeFilter);
    }

    setFilteredProducts(result);
  }, [search, categoryFilter, genderFilter, sizeFilter, allProducts]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-white to-amber-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
            TESSY <span className="text-rose-600">LUXE</span>
          </h1>
          <p className="text-2xl text-gray-700">“Dress Beautiful, Feel Confident.”</p>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6 py-8 border-b bg-white sticky top-0 z-40">
        <div className="flex flex-wrap gap-4 items-center">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-xl px-4 py-3 text-sm"
          >
            <option value="All">All Categories</option>
            <option value="Clothes">Clothes</option>
            <option value="Bags">Bags</option>
            <option value="Shoes">Shoes</option>
            <option value="Accessories">Accessories</option>
          </select>

          <select 
            value={genderFilter} 
            onChange={(e) => setGenderFilter(e.target.value)}
            className="border rounded-xl px-4 py-3 text-sm"
          >
            <option value="All">All Gender</option>
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Unisex">Unisex</option>
          </select>

          <select 
            value={sizeFilter} 
            onChange={(e) => setSizeFilter(e.target.value)}
            className="border rounded-xl px-4 py-3 text-sm"
          >
            <option value="All">All Sizes</option>
            {["XS","S","M","L","XL","XXL","One Size","36","37","38","39","40","41","42","43","44"].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <Button variant="outline" onClick={() => {
            setSearch("");
            setCategoryFilter("All");
            setGenderFilter("All");
            setSizeFilter("All");
          }}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-8">
          Our Collection ({filteredProducts.length})
        </h2>

        {filteredProducts.length === 0 ? (
          <p className="text-center py-20 text-xl text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}