"use client";

import { useEffect, useState } from "react";
import Head from "next/head";

export default function ArticlePage({ article }) {
  const [views, setViews] = useState(article.views || 0);

  useEffect(() => {
    if (!article._id) return;

    fetch(`/api/articles/${article._id}/view`, {
      method: "POST",
    })
      .then(res => res.json())
      .then(data => {
        if (data.views !== undefined) setViews(data.views);
      })
      .catch(err => console.error(err));
  }, [article._id]);

  return (
    <>
      <Head>
        <title>{article.title} | Globelynks News</title>

        <meta
          name="description"
          content={article.excerpt || article.content?.slice(0, 150)}
        />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta
          property="og:description"
          content={article.excerpt || article.content?.slice(0, 150)}
        />
        <meta property="og:image" content={article.image} />
        <meta
          property="og:url"
          content={`https://trendingnews.globelynks.com/articles/${article._id}`}
        />

        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <article className="max-w-3xl mx-auto px-6 py-10">

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {article.title}
        </h1>

        <p className="text-sm text-gray-500 mb-2">
          {article.source || "Globelynks"} ·{" "}
          {new Date(article.createdAt).toDateString()}
        </p>

        <p className="text-sm text-gray-500 mb-6">
          👁 {views.toLocaleString()} views
        </p>

        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full rounded-xl mb-8"
          />
        )}

        <div className="prose max-w-none whitespace-pre-line">
          {article.content}
        </div>

        {article.originalUrl && (
          <a
            href={article.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-red-600 font-semibold"
          >
            Read full story →
          </a>
        )}

      </article>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/articles/${params.id}`
  );

  if (!res.ok) return { notFound: true };

  const article = await res.json();

  return {
    props: { article },
  };
}