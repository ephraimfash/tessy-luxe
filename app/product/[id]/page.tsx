"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import WhatsAppButton from "@/components/WhatsAppButton";
import { ArrowLeft } from "lucide-react";

export default function ProductDetail() {

  const searchParams = useSearchParams();

  const data = searchParams.get("data");

  if (!data) {

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

  const product = JSON.parse(
    decodeURIComponent(data)
  );

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