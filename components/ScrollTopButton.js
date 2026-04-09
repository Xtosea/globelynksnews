"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      className="
      fixed 
      bottom-6 
      right-6 
      z-50 
      bg-black 
      text-white 
      p-3 
      rounded-full 
      shadow-lg 
      hover:bg-gray-800 
      transition
      "
    >
      <ArrowUp size={20} />
    </button>
  );
}