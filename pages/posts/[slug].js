import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"

export default function PostPage({ post }) {
  const slug = post.slug

  const [views, setViews] = useState(post.views || 0)
  const [comments, setComments] = useState([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  // Increment views
  useEffect(() => {
    if (!slug) return

    const viewed = localStorage.getItem(`viewed-${slug}`)
    if (viewed) return

    fetch(`/api/posts/${slug}/view`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        if (data.views !== undefined) {
          setViews(data.views)
          localStorage.setItem(`viewed-${slug}`, "true")
        }
      })
      .catch(err => console.error(err))
  }, [slug])

  // Fetch comments
  useEffect(() => {
    if (!slug) return

    fetch(`/api/comments?slug=${slug}`)
      .then(res => res.json())
      .then(data => setComments(data))
  }, [slug])

  // Submit comment
  const submitComment = async () => {
    if (!name.trim() || !message.trim()) {
      alert("Enter name and message")
      return
    }

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postSlug: slug,
        name,
        message,
      }),
    })

    if (res.ok) {
      const newComment = await res.json()
      setComments(prev => [...prev, newComment])
      setName("")
      setMessage("")
    }
  }

  return (
    <>
      <Head>
        <title>{post.title} | Globelynks News</title>

        <meta name="description" content={post.excerpt} />

        <link
          rel="canonical"
          href={`https://trendingnews.globelynks.com/posts/${post.slug}`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta
          property="og:url"
          content={`https://trendingnews.globelynks.com/posts/${post.slug}`}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <article className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

        <p className="text-sm text-gray-500 mb-2">
          {post.author} · {new Date(post.publishedAt).toDateString()}
        </p>

        <p className="text-sm text-gray-500 mb-6">
          👁 {views.toLocaleString()} views
        </p>

        {post.image && (
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={450}
            className="w-full rounded-xl mb-8"
          />
        )}

        <div className="prose prose-lg max-w-none whitespace-pre-line mb-10">
          {post.content}
        </div>

        {/* COMMENTS */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Comments</h3>

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
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Post Comment
          </button>

          <div className="mt-6 space-y-4">
            {comments.map(c => (
              <div key={c._id} className="border-b pb-3">
                <p className="font-semibold">{c.name}</p>

                <p className="text-sm text-gray-600">{c.message}</p>

                <p className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${params.slug}`
  )

  if (!res.ok) {
    return { notFound: true }
  }

  const post = await res.json()

  return {
    props: { post },
  }
}