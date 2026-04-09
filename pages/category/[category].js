"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CategoryPage() {
  const { category } = useParams();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    fetch("/api/articles")
      .then(res => res.json())
      .then(data => {
        const filtered = import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CategoryPage() {
  const router = useRouter();
  const { category } = router.query;

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    fetch("/api/articles")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          article =>
            article.category?.toLowerCase() === category.toLowerCase()
        );

        setArticles(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold capitalize">
          {category} News
        </h2>
        <p className="mt-4">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold capitalize mb-6">
        {category} News
      </h1>

      {articles.length === 0 && (
        <p>No articles yet in this category.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <Link
            key={article._id}
            href={`/articles/${article._id}`}
            className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div className="aspect-video bg-gray-100">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <p className="text-xs text-red-600 font-semibold uppercase mb-2">
                {article.source}
              </p>

              <h2 className="font-bold text-lg leading-tight">
                {article.title}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}(
          article =>
            article.category?.toLowerCase() === category.toLowerCase()
        );

        setArticles(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold capitalize">{category}</h2>
        <p className="mt-4">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold capitalize mb-6">
        {category} News
      </h1>

      {articles.length === 0 && (
        <p>No articles yet in this category.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <Link
            key={article._id}
            href={`/articles/${article._id}`}
            className="block border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            <div className="aspect-video bg-gray-100">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <p className="text-xs text-red-600 font-semibold uppercase mb-2">
                {article.source}
              </p>

              <h2 className="font-bold text-lg leading-tight">
                {article.title}
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}