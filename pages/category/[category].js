"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!category) return;

    Promise.all([
      fetch("/api/posts"),
      fetch("/api/articles")
    ])
      .then(async ([postRes, articleRes]) => {
        const postsData = await postRes.json();
        const articlesData = await articleRes.json();

        const combined = [...postsData, ...articlesData];

        setPosts(
          combined.filter(
            p => p.category?.toLowerCase() === category.toLowerCase()
          )
        );
      })
      .catch(err => console.error(err));
  }, [category]);

  if (!category) return null;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold capitalize mb-8">{category} News</h1>

        {posts.length === 0 && (
          <p className="text-gray-600">No articles yet in this category.</p>
        )}

        <div className="space-y-6">
          {posts.map(post => (
            <div key={post._id || post.slug} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/posts/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                {post.author || "Globelynks"} ·{" "}
                {post.publishedAt ? new Date(post.publishedAt).toDateString() : "Unknown date"}
              </p>

              <p className="text-gray-700">{post.excerpt || post.content?.slice(0, 200)}</p>

              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded mt-4"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}