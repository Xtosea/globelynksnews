"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import Navbar from "./Navbar";
import Footer from "./Footer";
import BackButton from "./BackButton";
import BreakingTicker from "./BreakingTicker";
import ScrollTopButton from "./ScrollTopButton";
import ReadingProgress from "./ReadingProgress";
import AdsterraBanner from "@/components/ads/AdsterraBanner";

import AdcashVideoSlider from "./AdcashVideoSlider";
import AdcashDisplayBanner from "./AdcashDisplayBanner";

export default function Layout({ children }) {
  const [posts, setPosts] = useState([]);
  const pathname = usePathname();

  const currentCategory =
    pathname && pathname.startsWith("/category/")
      ? pathname.split("/category/")[1]
      : null;

  const categories = ["world", "politics", "nigeria", "technology", "business"];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts for ticker:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      {/* Reading Progress */}
      <ReadingProgress />

      {/* Navbar */}
      <Navbar />

      <AdsterraBanner />


      {/* Ad Banner */}
      <AdcashDisplayBanner />

      {/* Breaking Ticker */}
      {posts.length > 0 && (
        <BreakingTicker posts={posts} category={currentCategory} />
      )}

      {/* Video Slider */}
      <AdcashVideoSlider />

      {/* Category Banner */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto">
          <Link
            href="/"
            className={`font-semibold whitespace-nowrap ${
              !currentCategory ? "underline" : ""
            }`}
          >
            🔥 Trending Headlines
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat}`}
              className={`whitespace-nowrap capitalize ${
                currentCategory === cat ? "underline font-bold" : ""
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6">
        <BackButton />
      </div>

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* More Headlines */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-xl font-bold mb-4">More Trending Headlines</h3>
          <Link href="/" className="text-red-600 font-semibold">
            View Latest News →
          </Link>
        </div>
      </div>

      {/* Scroll to Top */}
      <ScrollTopButton />

      {/* Footer */}
      <Footer />
    </>
  );
}