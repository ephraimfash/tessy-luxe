"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold tracking-tighter">
          TESSY <span className="text-rose-600">LUXE</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-rose-600 transition-colors">Shop</Link>
          <Link href="/#fashion" className="hover:text-rose-600 transition-colors">Fashion</Link>
          <Link href="/#beauty" className="hover:text-rose-600 transition-colors">Beauty</Link>
          <Link href="/admin" className="text-rose-600 hover:underline">Admin</Link>
        </nav>

        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}