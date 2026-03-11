import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Article from "@/models/Article";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("MONGODB_URI is missing!");
      return NextResponse.json([], { status: 200 });
    }

    await connectDB();

    // Fetch local posts
    const localPosts = await Post.find({}).sort({ publishedAt: -1 }).lean();

    // Fetch RSS articles
    const rssPosts = await Article.find({}).sort({ createdAt: -1 }).lean();

    // Merge and sort by newest first
    const allPosts = [...localPosts, ...rssPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return NextResponse.json(allPosts);
  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json([], { status: 200 });
  }
}