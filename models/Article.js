import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String
  },
  image: {
    type: String,
    default: "https://trendingnews.globelynks.com/no-image.jpg"
  },
  type: {
    type: String,
    enum: ["local", "rss"],
    default: "rss"
  },
  originalUrl: {
    type: String
  },
  source: {
    type: String
  },
  slug: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    default: "General"
  },
  tags: {
    type: [String],
    default: []
  },
  published: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Article || mongoose.model("Article", ArticleSchema);