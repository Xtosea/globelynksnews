import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String },
  image: { type: String },
  category: { type: String },
  author: { type: String },
  publishedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 } // <-- must be inside schema
})

export default mongoose.models.Post || mongoose.model("Post", PostSchema)