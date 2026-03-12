import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  // Article title
  title: {
    type: String,
    required: true,
    unique: true
  },

  // Main content or excerpt
  content: {
    type: String
  },

  // Image
  image: {
    type: String
  },

  // Article type
  type: {
    type: String,
    enum: ["local", "rss"],
    default: "rss"
  },

  // External RSS article link
  originalUrl: {
    type: String
  },

  // Source of article
  source: {
    type: String
  },

  // SEO slug
  slug: {
    type: String,
    unique: true,
    sparse: true
  },

  // Category
  category: {
    type: String,
    default: "General"
  },

  // Tags
  tags: {
    type: [String],
    default: []
  },

  // Publish control
  published: {
    type: Boolean,
    default: true
  },

  // Views counter (for trending)
  views: {
    type: Number,
    default: 0
  },

  // Date published
  publishedAt: {
    type: Date,
    default: Date.now
  },

  // Created time
  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);