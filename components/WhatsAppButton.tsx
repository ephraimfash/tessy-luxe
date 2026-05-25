"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

type WhatsAppButtonProps = {
  productName: string;
  price: number;
};

export default function WhatsAppButton({ productName, price }: WhatsAppButtonProps) {
  const phoneNumber = "2348021249714"; // ← CHANGE THIS TO HER WHATSAPP NUMBER

  const message = `Hello Tessy Luxe! 👋%0AI want to order:%0A*${productName}*%0APrice: ₦${price.toLocaleString()}%0APlease confirm availability.`;

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <Button 
      onClick={handleClick}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6 text-lg"
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Order on WhatsApp
    </Button>
  );
}