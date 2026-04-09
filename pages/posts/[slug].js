"use client";

import { useEffect, useState } from "react";
import Head from "next/head";

export default function PostPage({ post, meta }) {
  const slug = post.slug;

  // --- Views state ---
  const [views, setViews] = useState(post.views || 0);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/posts/${slug}/view`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        if (data.views !== undefined) setViews(data.views);
      })
      .catch(err => console.error("Failed to increment view:", err));
  }, [slug]);

  // --- Comments state ---
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/comments?slug=${slug}`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error("Failed to fetch comments:", err));
  }, [slug]);

  const submitComment = async () => {
    if (!name || !message) return alert("Please enter your name and message");

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postSlug: slug, name, message }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments(prev => [...prev, newComment]);
      setName("");
      setMessage("");
    } else {
      alert("Failed to post comment");
    }
  };

  return (
    <>
      <Head>
        <title>{meta.title} | Globelynks News</title>
        <meta name="description" content={meta.description} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:url" content={meta.url} />
        <meta property="og:site_name" content="Globelynks News" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={meta.image} />
      </Head>

      <article className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

        <p className="text-sm text-gray-500 mb-2">
          {post.author || "Globelynks"} ·{" "}
          {new Date(post.publishedAt).toDateString()}
        </p>

        <p className="text-sm text-gray-500 mb-6">👁 {views.toLocaleString()} views</p>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full rounded-xl mb-8"
          />
        )}

        <div className="prose prose-lg max-w-none whitespace-pre-line mb-10">
          {post.content || post.excerpt || ""}
        </div>

        {/* Comments Section */}
        <div className="mt-10">
          <h3 className="font-bold mb-4">Comments</h3>

          <input
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <textarea
            placeholder="Write comment..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          <button
            onClick={submitComment}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Post Comment
          </button>

          <div className="mt-6 space-y-4">
            {comments.map(c => (
              <div key={c._id} className="border-b pb-2">
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-gray-600">{c.message}</p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${params.slug}`);
  if (!res.ok) return { notFound: true };
  const post = await res.json();

  const meta = {
    title: post.title,
    description: post.excerpt || post.content?.slice(0, 150),
    image: post.image,
    url: `https://trendingnews.globelynks.com/posts/${post.slug}`,
  };

  return { props: { post, meta } };
}