import { useEffect, useState } from "react";
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
      <div className="max-w-6xl mx-auto px-4 py-6 w-full overflow-hidden">
        <h2 className="text-2xl font-bold capitalize">
          {category} News
        </h2>
        <p className="mt-4">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full overflow-hidden">
      
      {/* Category Title */}
      <h1 className="text-3xl font-bold capitalize mb-6">
        {category} News
      </h1>

      {/* Empty State */}
      {articles.length === 0 && (
        <p className="text-gray-500">
          No articles yet in this category.
        </p>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {articles.map(article => (
          <Link
            key={article._id}
            href={`/articles/${article._id}`}
            className="block bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
          >
            
            {/* Image */}
            <div className="w-full aspect-video overflow-hidden bg-gray-100">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">

              {/* Source */}
              <p className="text-xs text-red-600 font-semibold uppercase mb-2">
                {article.source}
              </p>

              {/* Title */}
              <h2 className="font-bold text-lg leading-tight line-clamp-2">
                {article.title}
              </h2>

              {/* Date */}
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