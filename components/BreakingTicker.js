"use client";

import Link from "next/link";

export default function BreakingTicker({ posts, category }) {
  const filteredPosts = category
    ? posts.filter((p) => p.category === category)
    : posts;

  const breakingPosts = filteredPosts.slice(0, 5);

  if (breakingPosts.length === 0) return null;

  return (
    <div className="bg-red-600 text-white flex items-center overflow-hidden w-full">

      <span className="bg-black px-4 py-2 font-bold whitespace-nowrap">
        BREAKING
      </span>

      <div className="overflow-hidden flex-1 py-2">
        <div className="inline-flex gap-8 animate-marquee whitespace-nowrap">
          {[...breakingPosts, ...breakingPosts].map((post, index) => (
            <Link
              key={post._id || post.slug || index}
              href={post.originalUrl || `/articles/${post.slug}`}
              className="font-semibold whitespace-nowrap"
            >
              🔴 {post.title}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}