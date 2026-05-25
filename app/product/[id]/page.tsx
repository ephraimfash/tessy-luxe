"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ArrowLeft } from "lucide-react";
import { Product } from "@/app/data/products";

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { id } = await params;
      
      // First try localStorage (where new admin products are saved)
      const saved = localStorage.getItem("tessyLuxeProducts");
      let allProducts: Product[] = [];

      if (saved) {
        allProducts = JSON.parse(saved);
      } else {
        // Fallback to initial products
        const { products: initial } = await import("@/app/data/products");
        allProducts = initial;
      }

      const foundProduct = allProducts.find(p => p.id === id);
      setProduct(foundProduct || null);
      setLoading(false);
    };

    fetchProduct();
  }, [params]);

  if (loading) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Product not found</h2>
        <Link href="/" className="text-rose-600 hover:underline mt-4 inline-block">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden border shadow-lg bg-gray-100">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <span className="uppercase tracking-widest text-rose-600 text-sm font-medium">
            {product.category}
          </span>
          
          <h1 className="text-4xl font-bold mt-3 leading-tight">{product.name}</h1>
          
          <p className="text-3xl font-semibold text-rose-600 mt-6">
            ₦{product.price.toLocaleString()}
          </p>

          {product.gender && (
            <p className="text-gray-600 mt-2">{product.gender} • {product.size} • {product.color}</p>
          )}

          <p className="text-gray-600 leading-relaxed mt-8 text-lg">
            {product.description}
          </p>

          <div className="mt-10">
            <WhatsAppButton 
              productName={product.name} 
              price={product.price} 
            />
          </div>

          <div className="mt-8 text-sm text-gray-500 space-y-1">
            <p>✅ Order via WhatsApp</p>
            <p>✅ Payment on delivery available</p>
            <p>✅ Quality guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
}