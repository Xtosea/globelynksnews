"use client";

import Link from "next/link";

export default function BreakingTicker({ posts, category }) {
  // Filter by category if provided
  const filteredPosts = category
    ? posts.filter((p) => p.category === category)
    : posts;

  const breakingPosts = filteredPosts.slice(0, 5);

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee gap-10 px-6">
        {breakingPosts.map((post) => (
          <Link
            key={post._id || post.slug}
            href={post.originalUrl || `/articles/${post.slug}`}
            target={post.originalUrl ? "_blank" : "_self"}
            rel={post.originalUrl ? "noopener noreferrer" : ""}
            className="font-semibold"
          >
            🔴 {post.title}
          </Link>
        ))}
      </div>
    </div>
  );
}