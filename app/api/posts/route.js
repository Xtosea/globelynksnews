import { NextResponse } from "next/server";
import { connectDB } from '@/lib/mongodb';
import Article from '@/models/Article';

export async function GET() {
  try {
    await connectDB();

    // Get all published articles, newest first
    const articles = await Article.find({ published: true })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(articles);
  } catch (err) {
    console.error("GET /api/articles error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}