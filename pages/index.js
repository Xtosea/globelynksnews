"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdBlock from "../components/AdBlock";
import StickyShare from "../components/StickyShare";
import Image from "next/image"; // <-- use next/image

export default function Home() {
  const [posts, setPosts] = useState([]);

  // Placeholder image if article/post has no image
  const placeholderImage = "/placeholder.png"; // make sure this exists in public folder

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
      <Navbar />
      <StickyShare />

      <main className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-3 space-y-10">
          {posts[0] && (
            <div>
              {/* Top post/article */}
              <a
                href={posts[0].originalUrl || `/articles/${posts[0].slug}`}
                target={posts[0].originalUrl ? "_blank" : "_self"}
                rel={posts[0].originalUrl ? "noopener noreferrer" : ""}
              >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 hover:text-red-600">
                  {posts[0].title}
                </h1>
              </a>

              {/* Image with next/image */}
              <Image
                src={posts[0].image || placeholderImage}
                alt={posts[0].title || "News Image"}
                width={1200} // adjust width
                height={600} // adjust height
                className="w-full h-[400px] object-cover rounded"
                placeholder="blur"
                blurDataURL={placeholderImage} // optional blur placeholder
              />

              {posts[0].source && (
                <p className="text-gray-400 text-sm mt-2">Source: {posts[0].source}</p>
              )}

              <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
                {posts[0].excerpt || posts[0].content || ""}
              </p>
            </div>
          )}

          <AdBlock />

          {/* Other posts/articles */}
          {posts.slice(1).map((post) => (
            <div key={post._id || post.slug || Math.random()} className="border-b pb-6">
              <a
                href={post.originalUrl || `/articles/${post.slug}`}
                target={post.originalUrl ? "_blank" : "_self"}
                rel={post.originalUrl ? "noopener noreferrer" : ""}
              >
                <h2 className="text-xl font-bold hover:text-red-600">{post.title}</h2>
              </a>

              <Image
                src={post.image || placeholderImage}
                alt={post.title || "News Image"}
                width={1200}
                height={400}
                className="w-full h-[200px] object-cover rounded my-2"
                placeholder="blur"
                blurDataURL={placeholderImage}
              />

              {post.source && (
                <p className="text-gray-400 text-sm">Source: {post.source}</p>
              )}

              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                {post.excerpt || post.content || ""}
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