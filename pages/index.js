"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdBlock from "../components/AdBlock";
import StickyShare from "../components/StickyShare";
import Link from "next/link";

export default function Home() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [postsRes, articlesRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/articles")
        ]);

        const postsData = await postsRes.json();
        const articlesData = await articlesRes.json();

        // Merge both arrays, sort by date descending
        const merged = [...postsData, ...articlesData].sort(
          (a, b) => new Date(b.createdAt || b.publishedAt) - new Date(a.createdAt || a.publishedAt)
        );

        setContent(merged);
      } catch (err) {
        console.error("Failed to fetch content:", err);
      }
    };

    fetchContent();
    const interval = setInterval(fetchContent, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <StickyShare />

      <main className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-3 space-y-10">
          {content.length > 0 && content[0] && (
            <div>
              <Link
                href={content[0].type === "rss" && content[0].originalUrl ? content[0].originalUrl : `/posts/${content[0].slug}`}
                target={content[0].type === "rss" ? "_blank" : "_self"}
              >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 hover:text-red-600">
                  {content[0].title}
                </h1>
              </Link>

              {content[0].image && (
                <img
                  src={content[0].image}
                  alt={content[0].title}
                  className="w-full h-[400px] object-cover rounded mb-2"
                />
              )}

              {content[0].source && (
                <p className="text-sm text-gray-400 mb-2">Source: {content[0].source}</p>
              )}

              {content[0].excerpt && (
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
                  {content[0].excerpt || content[0].content}
                </p>
              )}
            </div>
          )}

          <AdBlock />

          {content.slice(1).map((item) => (
            <div key={item._id} className="border-b pb-6">
              <Link
                href={item.type === "rss" && item.originalUrl ? item.originalUrl : `/posts/${item.slug}`}
                target={item.type === "rss" ? "_blank" : "_self"}
              >
                <h2 className="text-xl font-bold hover:text-red-600">{item.title}</h2>
              </Link>

              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[200px] object-cover rounded my-2"
                />
              )}

              {item.source && (
                <p className="text-sm text-gray-400">Source: {item.source}</p>
              )}

              {item.excerpt && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  {item.excerpt || item.content}
                </p>
              )}
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