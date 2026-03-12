import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";

export async function GET() {
  try {
    await connectDB();

    const articles = await Article.find({ published: true })
      .sort({ createdAt: -1 })
      .select("_id slug title excerpt content image source originalUrl type createdAt") // select all needed fields
      .lean();

    return NextResponse.json(articles);
  } catch (err) {
    console.error("GET /api/articles error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}