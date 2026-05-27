import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tessy Luxe",
  description: "Luxury Fashion Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">

        {/* TOP NAVBAR */}
        <header className="w-full border-b bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

            <Link
              href="/"
              className="text-2xl font-bold tracking-wide"
            >
              TESSY LUXE
            </Link>

            <nav className="flex items-center gap-6">

              <Link
                href="/"
                className="text-sm hover:text-rose-600 transition"
              >
                Home
              </Link>

              <Link
                href="/admin"
                className="text-sm hover:text-rose-600 transition"
              >
                Admin
              </Link>

            </nav>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main>
          {children}
        </main>

      </body>
    </html>
  );
}