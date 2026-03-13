// /app/api/import-news/route.js
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import slugify from "slugify";
import mongoose from "mongoose";
import Article from "@/models/Article";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // Required for Node <20. In Node 20+ global fetch works

const parser = new Parser();
const DEFAULT_IMAGE = "https://trendingnews.globelynks.com/no-image.jpg";

// List of RSS feeds (foreign + African/Nigeria)
const feeds = [
  { url: "https://rss.cnn.com/rss/edition.rss", category: "World" },
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "World" },
  { url: "https://www.punchng.com/feed/", category: "Nigeria" },
  { url: "https://www.vanguardngr.com/feed/", category: "Nigeria" },
  { url: "https://www.aljazeera.com/xml/rss/all.xml", category: "World" },
];

// MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}

// Extract image from RSS item
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

// Cache image locally in /public/news-images
async function cacheImage(url, slug) {
  try {
    if (!url) return null;

    const res = await fetch(url);
    if (!res.ok) return null;

    const ext = path.extname(new URL(url).pathname) || ".jpg";
    const filename = `${slug}${ext}`;
    const dir = path.join(process.cwd(), "public", "news-images");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, filename);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    return `/news-images/${filename}`;
  } catch (err) {
    console.error("Image caching failed:", err.message);
    return null;
  }
}

// GET endpoint for browser or cron
export async function GET() {
  try {
    await connectDB();

    let imported = 0;

    for (const feedInfo of feeds) {
      let feed;
      try {
        feed = await parser.parseURL(feedInfo.url);
      } catch (err) {
        console.error("Failed to fetch feed:", feedInfo.url, err.message);
        continue;
      }

      for (const item of feed.items) {
        const slug = slugify(item.title || "", { lower: true, strict: true });

        const exists = await Article.findOne({ slug });
        if (exists) continue;

        // Extract and cache image
        let image = extractImage(item);
        const cachedUrl = await cacheImage(image, slug);
        image = cachedUrl || DEFAULT_IMAGE;

        // Save to MongoDB
        try {
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
        } catch (err) {
          if (err.code === 11000) console.log("Skipped duplicate:", item.title);
          else console.error("Error saving article:", item.title, err.message);
        }
      }
    }

    return NextResponse.json({ success: true, imported });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}