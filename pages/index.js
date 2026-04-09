"use client";

import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdBlock from "../components/AdBlock";
import StickyShare from "../components/StickyShare";
import { categories } from "../data/categories";
import Link from "next/link";
import SocialShare from "../components/SocialShare";


export default function Home() {
  const [posts, setPosts] = useState([]);

  const placeholderImage = "/placeholder.png";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [postRes, articleRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/articles"),
        ]);

        const postData = await postRes.json();
        const articleData = await articleRes.json();

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

  return (
   
   <>
    
   
   <div className="border-b py-3 overflow-x-auto">
  <div className="flex gap-6 max-w-7xl mx-auto px-6">
    {categories.map((cat) => (
      <Link
        key={cat}
        href={`/category/${cat}`}
        className="whitespace-nowrap font-medium hover:text-red-600 capitalize"
      >
        {cat}
      </Link>
    ))}
  </div>
</div>

      <StickyShare />

      <main className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-10">

        {/* MAIN NEWS COLUMN */}
        <div className="md:col-span-3 space-y-10">

          {/* TOP ARTICLE */}
          {posts[0] && (
            <div>
              <a
                href={posts[0].originalUrl || `/articles/${posts[0].slug}`}
                target={posts[0].originalUrl ? "_blank" : "_self"}
                rel={posts[0].originalUrl ? "noopener noreferrer" : ""}
              >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 hover:text-red-600">
                  {posts[0].title}
                </h1>
              </a>

              {/* TOP IMAGE */}
              <div className="w-full aspect-video rounded overflow-hidden bg-gray-200">
  <img
    src={posts[0].image || "/placeholder.png"}
    alt={posts[0].title}
    loading="lazy"
    onError={(e) => {
      e.currentTarget.src = "/placeholder.png";
    }}
    className="w-full h-full object-cover"
  />
</div>

              {posts[0].source && (
                <p className="text-gray-400 text-sm mt-2">
                  Source: {posts[0].source}
                </p>
              )}

          <SocialShare post={posts[0]} />
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
                {posts[0].excerpt || posts[0].content || ""}
              </p>
            </div>
          )}

          <AdBlock />

          {/* OTHER ARTICLES */}
          {posts.slice(1).map((post) => (
            <div key={post._id || post.slug} className="border-b pb-6">

              <a
                href={post.originalUrl || `/articles/${post.slug}`}
                target={post.originalUrl ? "_blank" : "_self"}
                rel={post.originalUrl ? "noopener noreferrer" : ""}
              >
                <h2 className="text-xl font-bold hover:text-red-600">
                  {post.title}
                </h2>
              </a>

              {/* ARTICLE IMAGE */}
              <div className="w-full aspect-video rounded overflow-hidden bg-gray-200">
  <img
    src={post.image || "/placeholder.png"}
    alt={post.title}
    loading="lazy"
    onError={(e) => {
      e.currentTarget.src = "/placeholder.png";
    }}
    className="w-full h-full object-cover"
  />
</div>
              <SocialShare post={post} />
              {post.source && (
                <p className="text-gray-400 text-sm">
                  Source: {post.source}
                </p>
              )}

              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                {post.excerpt || post.content || ""}
              </p>
            </div>
          ))}

        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <AdBlock />
        </div>

      </main>

      <Footer />
    </>
  );
}