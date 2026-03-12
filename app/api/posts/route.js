import { NextResponse } from "next/server";
import { connectDB } from '@/lib/mongodb';
import Post from "../../../models/Post";

export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find({})
      .sort({ publishedAt: -1 });

    return NextResponse.json(posts);
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}