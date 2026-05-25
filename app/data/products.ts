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

export const products: Product[] = [
  {
    id: "1",
    name: "Elegant Silk Midi Dress",
    price: 28500,
    category: "Clothes",
    gender: "Women",
    size: "M",
    color: "Burgundy",
    description: "Luxurious silk midi dress perfect for any occasion. Timeless elegance.",
    images: ["https://picsum.photos/id/1015/800/800"],
    featured: true,
  },
  {
    id: "2",
    name: "Classic Leather Handbag",
    price: 24500,
    category: "Bags",
    gender: "Women",
    color: "Black",
    description: "Premium quality leather handbag with gold hardware and spacious interior.",
    images: ["https://picsum.photos/id/1060/800/800"],
  },
  {
    id: "3",
    name: "Stylish Unisex Sneakers",
    price: 18500,
    category: "Shoes",
    gender: "Unisex",
    size: "40",
    color: "White",
    description: "Comfortable and trendy sneakers perfect for everyday wear.",
    images: ["https://picsum.photos/id/21/800/800"],
  },
];