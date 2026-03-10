import { connectDB } from "@/lib/mongodb"
import Post from "@/models/Post"
import { NextResponse } from "next/server"

export async function POST(req, { params }) {
  await connectDB()

  const post = await Post.findOneAndUpdate(
    { slug: params.slug },
    { $inc: { views: 1 } },
    { new: true }
  )

  return NextResponse.json({ views: post.views })
}