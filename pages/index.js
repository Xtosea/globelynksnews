"use client";

import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AdBlock from "../components/AdBlock"
import StickyShare from "../components/StickyShare"
import BreakingTicker from "../components/BreakingTicker"

import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = () => {
      fetch("/api/posts")
        .then(res => res.json())
        .then(data => setPosts(data))
        .catch(err => console.error(err))
    }

    fetchPosts()
    const interval = setInterval(fetchPosts, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Navbar />
      <BreakingTicker posts={posts} />
      <StickyShare />

      <main className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-3 space-y-10">
          {posts[0] && (
            <div>
              <Link href={`/posts/${posts[0].slug}`}>
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 hover:text-red-600">
                  {posts[0].title}
                </h1>
              </Link>

              {posts[0].image && (
                <img
                  src={posts[0].image}
                  alt={posts[0].title}
                  className="w-full h-[400px] object-cover rounded"
                />
              )}

              <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
                {posts[0].excerpt}
              </p>
            </div>
          )}

          <AdBlock />

          {posts.slice(1).map(post => (
            <div key={post._id} className="border-b pb-6">
              <Link href={`/posts/${post.slug}`}>
                <h2 className="text-xl font-bold hover:text-red-600">
                  {post.title}
                </h2>
              </Link>

              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                {post.excerpt}
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
  )
}