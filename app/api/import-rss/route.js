// /app/api/posts/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Article from "@/models/Article";

export async function GET() {
  try {
    // Return empty array if DB is not configured
    if (!process.env.MONGODB_URI) {
      console.warn("MONGODB_URI not set!");
      return NextResponse.json([], { status: 200 });
    }

    // Connect to DB safely
    await connectDB();

    const localPosts = await Post.find({}).sort({ publishedAt: -1 }).lean();
    const rssPosts = await Article.find({}).sort({ createdAt: -1 }).lean();

    const allPosts = [...localPosts, ...rssPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const safePosts = allPosts.map(post => ({
      _id: post._id,
      slug: post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : ""),
      title: post.title || "Untitled",
      excerpt: post.excerpt || "",
      image: post.image || "",
      createdAt: post.createdAt || post.publishedAt || new Date(),
      source: post.source || "Local",
    }));

    return NextResponse.json(safePosts);

  } catch (err) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json([], { status: 200 });
  }
}