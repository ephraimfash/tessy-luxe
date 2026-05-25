import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-80 overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.featured && (
            <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs px-3 py-1 rounded-full">
              Featured
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
          <p className="text-xl font-bold text-rose-600">
            ₦{product.price.toLocaleString()}
          </p>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {product.description}
        </p>

        <Link href={`/product/${product.id}`}>
          <button className="w-full border border-gray-300 hover:border-black py-3 rounded-xl text-sm font-medium transition-colors">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}