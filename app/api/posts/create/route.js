import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from '@/lib/mongodb';
import Post from '../../../../models/Post'

export async function POST(req) {
  try {
    // 🔐 Get Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }

    // ✅ Verify token
    jwt.verify(token, process.env.JWT_SECRET);

    // 📦 Parse JSON body
    const body = await req.json();

    if (!body.title || !body.excerpt || !body.content) {
      return NextResponse.json(
        { message: "Title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    // 🔌 Connect to MongoDB
    await connectDB();

    // ✍️ Create new post
    const post = await Post.create({
      ...body,
      publishedAt: new Date()
    });

    return NextResponse.json(post, { status: 201 });

  } catch (err) {
    console.error("POST /api/posts/create error:", err);

    if (err.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}