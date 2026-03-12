"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdBlock from "../components/AdBlock";
import StickyShare from "../components/StickyShare";
import BreakingTicker from "../components/BreakingTicker";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };

    fetchPosts();

    const interval = setInterval(fetchPosts, 60000); // refresh every 60s

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <BreakingTicker posts={posts} />
      <StickyShare />

      <main className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-10">
        
        {/* Main News Column */}
        <div className="md:col-span-3 space-y-10">

          {/* Featured Article */}
          {posts[0] && (
            <div>
              <Link href={`/articles/${posts[0].slug || posts[0]._id}`}>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 hover:text-red-600">
                  {posts[0].title}
                </h1>
              </Link>

              {posts[0].image && (
                <img
                  src={posts[0].image}
                  alt={posts[0].title}
                  className="w-full h-[400px] object-cover rounded"
                />
              )}

              <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
                {posts[0].excerpt}
              </p>
            </div>
          )}

          {/* Other Articles */}
          {posts.slice(1).map((post) => (
            <div key={post._id} className="border-b pb-6">
              <Link href={`/articles/${post.slug || post._id}`}>
                <h2 className="text-xl font-bold hover:text-red-600">
                  {post.title}
                </h2>
              </Link>

              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                {post.excerpt}
              </p>
            </div>
          ))}

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdBlock />
        </div>

      </main>

      <Footer />
    </>
  );
}