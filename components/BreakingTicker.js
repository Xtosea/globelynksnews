"use client";

import Link from "next/link";

export default function BreakingTicker({ posts, category }) {
  const filteredPosts = category
    ? posts.filter((p) => p.category === category)
    : posts;

  const breakingPosts = filteredPosts.slice(0, 5);

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex gap-10 animate-marquee whitespace-nowrap px-6">
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