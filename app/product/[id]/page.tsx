"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import WhatsAppButton from "@/components/WhatsAppButton";
import { ArrowLeft } from "lucide-react";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function ProductDetail() {

  const params = useParams();

  const [product, setProduct] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchAllProducts() {

      try {

        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/products?select=*`,
          {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }
        );

        const data = await res.json();

        const found = data.find(
          (p: any) =>
            String(p.id) === String(params.id)
        );

        setProduct(found || null);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    }

    fetchAllProducts();

  }, [params.id]);

  if (loading) {

    return (
      <div className="text-center py-20">
        Loading product...
      </div>
    );
  }

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
          ← Return Home
        </Link>

      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8"
      >
        <ArrowLeft size={20} />
        Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12">

        <div className="relative aspect-square rounded-3xl overflow-hidden border shadow-lg bg-gray-100">

          <Image
            src={product.images}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
            priority
          />

        </div>

        <div className="flex flex-col">

          <span className="uppercase tracking-widest text-rose-600 text-sm font-medium">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold mt-3">
            {product.name}
          </h1>

          <p className="text-3xl font-semibold text-rose-600 mt-6">
            ₦{Number(product.price).toLocaleString()}
          </p>

          <p className="text-gray-600 mt-4">
            {product.gender}
            {product.size && ` • ${product.size}`}
            {product.color && ` • ${product.color}`}
          </p>

          <p className="text-gray-600 leading-relaxed mt-8 text-lg">
            {product.description}
          </p>

          <div className="mt-10">

            <WhatsAppButton
              productName={product.name}
              price={product.price}
            />

          </div>

        </div>
      </div>
    </div>
  );
}