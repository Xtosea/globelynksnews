// /app/api/import-news/route.js
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import slugify from "slugify";
import mongoose from "mongoose";
import Article from "@/models/Article";
import { NextResponse } from "next/server";

const parser = new Parser();
const DEFAULT_IMAGE =
  "https://trendingnews.globelynks.com/no-image.jpg";

const feeds = [
  { url: "https://rss.cnn.com/rss/edition.rss", category: "World" },
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "World" },
  { url: "https://www.punchng.com/feed/", category: "Nigeria" }
];

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

function extractImage(item) {
  let image = null;
  if (item.enclosure?.url) image = item.enclosure.url;
  else if (item["media:content"]?.url) image = item["media:content"].url;
  else if (item["media:thumbnail"]?.url) image = item["media:thumbnail"].url;
  else if (item.content || item.contentSnippet) {
    const html = item.content || item.contentSnippet;
    const $ = cheerio.load(html);
    const img = $("img").first().attr("src");
    if (img) image = img;
  }
  if (image && image.startsWith("/")) {
    try {
      image = new URL(image, item.link).href;
    } catch {
      image = DEFAULT_IMAGE;
    }
  }
  return image || DEFAULT_IMAGE;
}

// ✅ Browser GET endpoint
export async function GET() {
  try {
    await connectDB();
    let imported = 0;

    for (const feedInfo of feeds) {
      const feed = await parser.parseURL(feedInfo.url);
      for (const item of feed.items) {
        const slug = slugify(item.title || "", { lower: true, strict: true });
        const exists = await Article.findOne({ slug });
        if (exists) continue;

        const image = extractImage(item);

        await Article.create({
          title: item.title,
          content: item.contentSnippet || "",
          image,
          originalUrl: item.link,
          source: feed.title,
          slug,
          category: feedInfo.category,
          publishedAt: item.pubDate || new Date(),
        });

        imported++;
      }
    }

    return NextResponse.json({ success: true, imported });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}