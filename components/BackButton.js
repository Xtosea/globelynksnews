"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      className="
      fixed 
      bottom-6 
      left-6 
      z-50 
      bg-red-600 
      hover:bg-red-700 
      text-white 
      p-3 
      rounded-full 
      shadow-lg 
      transition
      "
    >
      <ArrowLeft size={20} />
    </button>
  );
}