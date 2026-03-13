import mongoose from "mongoose";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import slugify from "slugify";
import Article from "@/models/Article";
import { cacheImage } from "@/utils/cacheImage";

const DEFAULT_IMAGE = "https://trendingnews.globelynks.com/no-image.jpg";

const parser = new Parser({
  timeout: 10000,
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = true;
}

// Extract image from RSS item
function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;

  if (item["media:content"]?.url) return item["media:content"].url;

  if (item["media:thumbnail"]?.url) return item["media:thumbnail"].url;

  if (item.content) {
    const $ = cheerio.load(item.content);
    const img = $("img").first().attr("src");
    if (img) return img;
  }

  if (item.contentSnippet) {
    const $ = cheerio.load(item.contentSnippet);
    const img = $("img").first().attr("src");
    if (img) return img;
  }

  return DEFAULT_IMAGE;
}

// RSS feeds
const feeds = [
  { url: "https://rss.cnn.com/rss/edition.rss", category: "World" },
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "World" },
  { url: "https://www.punchng.com/feed/", category: "Nigeria" },
  { url: "https://www.vanguardngr.com/feed/", category: "Nigeria" },
];

// API handler
export async function GET() {
  try {
    await connectDB();

    let imported = 0;

    for (const feedInfo of feeds) {
      try {
        const feed = await parser.parseURL(feedInfo.url);

        for (const item of feed.items) {
          if (!item.title) continue;

          const slug = slugify(item.title, { lower: true, strict: true });

          const exists = await Article.findOne({ slug });
          if (exists) continue;

          let image = extractImage(item);

          // Cache image locally
          try {
            const cached = await cacheImage(image, slug);
            if (cached) image = cached;
          } catch {
            image = DEFAULT_IMAGE;
          }

          await Article.create({
            title: item.title,
            content: item.contentSnippet || "",
            image,
            originalUrl: item.link,
            source: feed.title || "RSS Feed",
            slug,
            category: feedInfo.category,
            publishedAt: item.pubDate || new Date(),
          });

          imported++;
        }

      } catch (feedError) {
        console.log("Feed failed:", feedInfo.url);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `${imported} articles imported`,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Import News Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}