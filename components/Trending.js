"use client";
import { useEffect, useState } from "react";

export default function Trending() {
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/articles/trending")
      .then(res => res.json())
      .then(data => {
        setTrending(data.topArticles);
        setCategories(data.categoryCount);
      });
  }, []);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Trending Articles</h2>
      <ul>
        {trending.map(article => (
          <li key={article._id} className="mb-1">
            {article.title} ({article.views} views)
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-4 mb-2">Hot Categories</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat._id}>{cat._id} ({cat.count})</li>
        ))}
      </ul>
    </div>
  );
}