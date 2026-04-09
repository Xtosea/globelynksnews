"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide button on homepage
  if (pathname === "/") return null;

  return (
    <button
      onClick={() => router.back()}
      className="mt-4 mb-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:opacity-80 transition"
    >
      ← Back
    </button>
  );
}