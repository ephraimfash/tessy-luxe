"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import WhatsAppButton from "@/components/WhatsAppButton";
import { ArrowLeft } from "lucide-react";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const [product, setProduct] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const { id } = await params;

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/products?id=eq.${id}&select=*`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );

        const data = await res.json();

        if (data && data.length > 0) {
          setProduct(data[0]);
        }

      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    fetchProduct();

  }, [params]);

  // LOADING
  if (loading) {
    return (
      <div className="text-center py-20">
        Loading product...
      </div>
    );
  }

  // NOT FOUND
  if (!product) {
    return (
      <div className="text-center py-20">

        <h2 className="text-2xl font-semibold">
          Product not found
        </h2>

        <Link
          href="/"
          className="text-rose-600 hover:underline mt-4 inline-block"
        >
          ← Back to Shop
        </Link>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* BACK BUTTON */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">

        {/* IMAGE */}
        <div className="relative aspect-square rounded-3xl overflow-hidden border shadow-lg bg-gray-100">

          <Image
            src={product.images || "/placeholder.jpg"}
            alt={product.name || "Product"}
            fill
            className="object-cover"
            unoptimized
            priority
          />

        </div>

        {/* DETAILS */}
        <div className="flex flex-col">

          <span className="uppercase tracking-widest text-rose-600 text-sm font-medium">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold mt-3 leading-tight">
            {product.name}
          </h1>

          <p className="text-3xl font-semibold text-rose-600 mt-6">
            ₦{Number(product.price).toLocaleString()}
          </p>

          {(product.gender ||
            product.size ||
            product.color) && (
            <p className="text-gray-600 mt-2">

              {product.gender}

              {product.size &&
                ` • ${product.size}`}

              {product.color &&
                ` • ${product.color}`}

            </p>
          )}

          <p className="text-gray-600 leading-relaxed mt-8 text-lg">
            {product.description}
          </p>

          {/* WHATSAPP */}
          <div className="mt-10">

            <WhatsAppButton
              productName={product.name}
              price={product.price}
            />

          </div>

          {/* EXTRA INFO */}
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