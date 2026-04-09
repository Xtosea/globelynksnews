"use client";

import Link from "next/link";

export default function BreakingTicker({ posts, category }) {
  const filteredPosts = category
    ? posts.filter((p) => p.category === category)
    : posts;

  const breakingPosts = filteredPosts.slice(0, 5);

  if (breakingPosts.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden w-full">
      
      <div className="relative w-full overflow-hidden">
        
        <div className="flex gap-8 animate-marquee whitespace-nowrap">
          {[...breakingPosts, ...breakingPosts].map((post, index) => (
            <Link
              key={post._id || post.slug || index}
              href={post.originalUrl || `/articles/${post.slug}`}
              target={post.originalUrl ? "_blank" : "_self"}
              rel={post.originalUrl ? "noopener noreferrer" : ""}
              className="font-semibold whitespace-nowrap shrink-0"
            >
              🔴 {post.title}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}