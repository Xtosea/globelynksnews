"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import BreakingTicker from "./BreakingTicker";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const [posts, setPosts] = useState([]);

  // Fetch latest posts for the breaking ticker
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
      {/* Navbar */}
      <Navbar />

      {/* Breaking News Ticker */}
      {posts.length > 0 && <BreakingTicker posts={posts} />}

      {/* Category Banner */}
      <div className="bg-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto">
          <Link href="/" className="font-semibold whitespace-nowrap">
            🔥 Trending Headlines
          </Link>
          <Link href="/category/world" className="whitespace-nowrap">
            World
          </Link>
          <Link href="/category/politics" className="whitespace-nowrap">
            Politics
          </Link>
          <Link href="/category/nigeria" className="whitespace-nowrap">
            Nigeria
          </Link>
          <Link href="/category/technology" className="whitespace-nowrap">
            Technology
          </Link>
          <Link href="/category/business" className="whitespace-nowrap">
            Business
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* More Headlines Section */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-xl font-bold mb-4">More Trending Headlines</h3>
          <Link href="/" className="text-red-600 font-semibold">
            View Latest News →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}