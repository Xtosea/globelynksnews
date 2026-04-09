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
import AdsterraBanner1 from "@/components/ads/AdsterraBanner1";

import AdcashVideoSlider from "./AdcashVideoSlider";
import AdcashDisplayBanner from "./AdcashDisplayBanner";

export default function Layout({ children }) {
  const [posts, setPosts] = useState([]);
  const pathname = usePathname();

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

      {/* Ads */}
      <AdsterraBanner1 />
      <AdcashDisplayBanner />

      {/* Breaking Ticker */}
    {posts.length > 0 && pathname === "/" && (
  <BreakingTicker posts={posts} />
)}

      {/* Video Slider */}
      <AdcashVideoSlider />

      {/* Trending Headlines Link */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-6 flex">
          <Link
            href="/"
            className="font-semibold text-sm md:text-base hover:underline"
          >
            🔥 Trending Headlines
          </Link>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 mt-4">
        <BackButton />
      </div>

      {/* Main Content */}
      <main className="min-h-screen max-w-7xl mx-auto px-6 py-6">{children}</main>

      {/* More Headlines */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-xl font-bold mb-4">More Trending Headlines</h3>
          <Link href="/" className="text-red-600 font-semibold hover:underline">
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