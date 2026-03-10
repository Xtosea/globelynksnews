"use client"

import Link from "next/link"

export default function BreakingTicker({ posts }) {
  const breakingPosts = posts.slice(0, 5)

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee gap-10 px-6">
        {breakingPosts.map(post => (
          <Link key={post._id} href={`/posts/${post.slug}`} className="font-semibold">
            🔴 {post.title}
          </Link>
        ))}
      </div>
    </div>
  )
}