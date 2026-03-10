import { connectDB } from '@/lib/mongodb';
import Comment from "@/models/Comment"
import { NextResponse } from "next/server"

export async function POST(req) {
  const body = await req.json()
  await connectDB()

  const comment = await Comment.create(body)
  return NextResponse.json(comment)
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")

  await connectDB()
  const comments = await Comment.find({ postSlug: slug }).sort({ createdAt: -1 })

  return NextResponse.json(comments)
}