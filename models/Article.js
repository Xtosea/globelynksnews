import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  // Core content
  title: { type: String, required: true, unique: true },
  content: { type: String }, // optional for RSS (can store excerpt)
  
  // Hybrid type
  type: { 
    type: String, 
    enum: ["local", "rss"], 
    default: "local" 
  },

  // RSS specific
  originalUrl: { type: String },  // external link
  source: { type: String },       // e.g. TechCrunch
  image: { type: String },

  // SEO
  slug: { type: String, unique: true, sparse: true },

  category: { type: String, default: "General" },
  tags: { type: [String], default: [] },

  published: { type: Boolean, default: true },
  views: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Article ||
  mongoose.model("Article", ArticleSchema);