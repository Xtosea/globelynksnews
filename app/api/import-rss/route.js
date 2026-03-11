// /app/api/posts/route.js
import { NextResponse } from "next/server";      // Next.js response helpers
import { connectDB } from "@/lib/mongodb";       // Function to connect to MongoDB
import Post from "@/models/Post";                // Local posts schema
import Article from "@/models/Article";          // RSS posts schema

export async function GET() {
  try {
    // ✅ Ensure MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.warn("MONGODB_URI is missing!");
      return NextResponse.json([], { status: 200 });
    }

    // 🔌 Connect to MongoDB
    await connectDB();

    // 🔹 Fetch local posts
    const localPosts = await Post.find({})
      .sort({ publishedAt: -1 })
      .lean();

    // 🔹 Fetch RSS articles
    const rssPosts = await Article.find({})
      .sort({ createdAt: -1 })
      .lean();

    // 🔹 Merge and sort all posts by newest first
    const allPosts = [...localPosts, ...rssPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // 🔹 Ensure all posts have required fields for homepage
    const safePosts = allPosts.map(post => ({
      _id: post._id,
      slug: post.slug || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : ""),
      title: post.title || "Untitled",
      excerpt: post.excerpt || "",
      image: post.image || "",
      createdAt: post.createdAt || post.publishedAt || new Date(),
      source: post.source || "Local",
    }));

    // ✅ Return merged posts
    return NextResponse.json(safePosts);

  } catch (err) {
    console.error("GET /api/posts error:", err);
    // 🔹 Never crash build, return empty array on error
    return NextResponse.json([], { status: 200 });
  }
}