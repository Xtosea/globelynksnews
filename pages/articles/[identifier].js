// pages/articles/[identifier].js

import { connectDB } from "@/lib/mongodb"
import Article from "@/models/Article"
import mongoose from "mongoose"

export async function getServerSideProps({ params }) {
  await connectDB()

  const { identifier } = params
  let post = null

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    post = await Article.findById(identifier).lean()
  }

  if (!post) {
    post = await Article.findOne({ slug: identifier }).lean()
  }

  if (!post) {
    return { notFound: true }
  }

  // Redirect RSS articles
  if (post.type === "rss" && post.originalUrl) {
    return {
      redirect: {
        destination: post.originalUrl,
        permanent: false,
      },
    }
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  }
}

export default function ArticlePage({ post }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded mb-4"
        />
      )}

      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {post.content}
      </p>

      {post.source && !post.originalUrl && (
        <p className="mt-4 text-gray-400 text-sm">
          Source: {post.source}
        </p>
      )}
    </div>
  )
}