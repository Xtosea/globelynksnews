"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdBlock from "../components/AdBlock";
import StickyShare from "../components/StickyShare";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [postRes, articleRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/articles"),
        ]);

        const postData = await postRes.json();
        const articleData = await articleRes.json();

        // Combine and sort by newest first
        const combined = [...postData, ...articleData].sort((a, b) => {
          const dateA = new Date(a.publishedAt || a.createdAt);
          const dateB = new Date(b.publishedAt || b.createdAt);
          return dateB - dateA;
        });

        setPosts(combined);
      } catch (err) {
        console.error("Failed to fetch posts/articles:", err);
      }
    };

    fetchPosts();
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  const placeholderImage = "/placeholder.jpg"; // Make sure you have this in /public

  return (
    <>
      <Navbar />
      <StickyShare />

      <main className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-3 space-y-10">
          {posts.length > 0 && (
            <div>
              {/* Top post or article */}
              <a
                href={posts[0]?.originalUrl || `/articles/${posts[0]?.slug}`}
                target={posts[0]?.originalUrl ? "_blank" : "_self"}
                rel={posts[0]?.originalUrl ? "noopener noreferrer" : ""}
              >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 hover:text-red-600">
                  {posts[0]?.title || "No Title"}
                </h1>
              </a>

              <Image
                src={posts[0]?.image || placeholderImage}
                alt={posts[0]?.title || "News Image"}
                width={800}
                height={400}
                className="w-full h-[400px] object-cover rounded"
                unoptimized
              />

              {posts[0]?.source && (
                <p className="text-gray-400 text-sm mt-2">
                  Source: {posts[0]?.source}
                </p>
              )}

              <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
                {posts[0]?.excerpt || posts[0]?.content || "No description available."}
              </p>
            </div>
          )}

          <AdBlock />

          {posts.slice(1).map((post) => (
            <div key={post._id || post.slug} className="border-b pb-6">
              <a
                href={post?.originalUrl || `/articles/${post?.slug}`}
                target={post?.originalUrl ? "_blank" : "_self"}
                rel={post?.originalUrl ? "noopener noreferrer" : ""}
              >
                <h2 className="text-xl font-bold hover:text-red-600">
                  {post?.title || "No Title"}
                </h2>
              </a>

              <Image
                src={post?.image || placeholderImage}
                alt={post?.title || "News Image"}
                width={600}
                height={200}
                className="w-full h-[200px] object-cover rounded my-2"
                unoptimized
              />

              {post?.source && (
                <p className="text-gray-400 text-sm">Source: {post.source}</p>
              )}

              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                {post?.excerpt || post?.content || "No description available."}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <AdBlock />
        </div>
      </main>

      <Footer />
    </>
  );
}