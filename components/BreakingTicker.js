"use client";

import Link from "next/link";

export default function BreakingTicker({ posts, category }) {
  // Filter posts by category if provided
  const filteredPosts = category
    ? posts.filter((p) => p.category === category)
    : posts;

  const breakingPosts = filteredPosts.slice(0, 5);

  if (breakingPosts.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex gap-10 animate-marquee whitespace-nowrap px-6">
        {/* Repeat posts once for smooth continuous scroll */}
        {[...breakingPosts, ...breakingPosts].map((post) => (
          <Link
            key={post._id || post.slug}
            href={post.originalUrl || `/articles/${post.slug}`}
            target={post.originalUrl ? "_blank" : "_self"}
            rel={post.originalUrl ? "noopener noreferrer" : ""}
            className="font-semibold whitespace-nowrap"
          >
            🔴 {post.title}
          </Link>
        ))}
      </div>
    </div>
  );
}