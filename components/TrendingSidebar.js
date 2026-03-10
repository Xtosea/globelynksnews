"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function TrendingSidebar() {
  const [trending, setTrending] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch("/api/articles/trending")
        const data = await res.json()

        // Top 5 trending articles by views
        const topArticles = data.topArticles.slice(0, 5)
        setTrending(topArticles)

        // Hot categories (sorted by count)
        const hotCats = data.categoryCount.slice(0, 5)
        setCategories(hotCats)
      } catch (err) {
        console.error(err)
      }
    }

    fetchTrending()
    const interval = setInterval(fetchTrending, 60000) // refresh every 1 min
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Trending Articles */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4">Trending Articles</h3>
        <ul className="space-y-3">
          {trending.map(article => (
            <li key={article._id}>
              <Link href={`/articles/${article._id}`}>
                <h4 className="text-sm font-semibold hover:text-red-600">{article.title}</h4>
              </Link>
              <small className="text-gray-500 dark:text-gray-400">
                {article.views} views | {article.category}
              </small>
            </li>
          ))}
          {trending.length === 0 && <p className="text-gray-400 text-sm">No trending articles yet</p>}
        </ul>
      </div>

      {/* Hot Categories */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4">Hot Categories</h3>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat._id}>
              <Link href={`/category/${cat._id.toLowerCase()}`}>
                <span className="text-sm font-semibold hover:text-red-600">{cat._id}</span>
              </Link>
              <small className="text-gray-500 dark:text-gray-400">({cat.count} articles)</small>
            </li>
          ))}
          {categories.length === 0 && <p className="text-gray-400 text-sm">No active categories yet</p>}
        </ul>
      </div>
    </div>
  )
}