export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Clothes" | "Bags" | "Shoes" | "Accessories";
  gender: "Men" | "Women" | "Unisex";
  size?: string;
  color?: string;
  description: string;
  images: string[];
  featured?: boolean;
};

// Empty for now - we'll load from Supabase
export const products: Product[] = [];