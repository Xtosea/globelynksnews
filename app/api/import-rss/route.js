// /app/api/posts/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Article from "@/models/Article";

export async function GET() {
  try {
    // 🔹 Make sure Mongo URI exists
    if (!process.env.MONGODB_URI) {
      console.warn("MONGODB_URI is missing!");
      return NextResponse.json([], { status: 200 });
    }

    // 🔌 Connect to MongoDB safely
    try {
      await connectDB();
    } catch (dbErr) {
      console.error("MongoDB connection failed:", dbErr);
      return NextResponse.json([], { status: 200 });
    }

    // 🔹 Fetch local posts safely
    let localPosts = [];
    try {
      localPosts = await Post.find({}).sort({ publishedAt: -1 }).lean();
    } catch (err) {
      console.error("Fetching local posts failed:", err);
    }

    // 🔹 Fetch RSS posts safely
    let rssPosts = [];
    try {
      rssPosts = await Article.find({}).sort({ createdAt: -1 }).lean();
    } catch (err) {
      console.error("Fetching RSS posts failed:", err);
    }

    // 🔹 Merge and sort by newest first
    const allPosts = [...localPosts, ...rssPosts].sort(
      (a, b) => new Date(b.createdAt || b.publishedAt || Date.now()) - new Date(a.createdAt || a.publishedAt || Date.now())
    );

    // 🔹 Ensure every post has safe fields
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
    console.error("Unexpected /api/posts error:", err);
    // 🔹 Always return empty array on any failure
    return NextResponse.json([], { status: 200 });
  }
}