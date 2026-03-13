import mongoose from "mongoose";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import slugify from "slugify";
import Article from "@/models/Article";
import { cacheImage } from "@/utils/cacheImage";

const parser = new Parser();
const DEFAULT_IMAGE = "https://trendingnews.globelynks.com/no-image.jpg";

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set");

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Helper: extract image from RSS item
function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item["media:content"]?.url) return item["media:content"].url;
  if (item["media:thumbnail"]?.url) return item["media:thumbnail"].url;

  if (item.content || item.contentSnippet) {
    const html = item.content || item.contentSnippet;
    const $ = cheerio.load(html);
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
];

// API Handler
export async function GET(req) {
  try {
    let imported = 0;

    for (const feedInfo of feeds) {
      const feed = await parser.parseURL(feedInfo.url);

      for (const item of feed.items) {
        const slug = slugify(item.title || "", { lower: true, strict: true });
        const exists = await Article.findOne({ slug });
        if (exists) continue;

        // Get image & cache locally
        let image = extractImage(item);
        const cachedUrl = await cacheImage(image, slug);
        image = cachedUrl || DEFAULT_IMAGE;

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

    return new Response(
      JSON.stringify({ success: true, message: `${imported} articles imported` }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Import News Error:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  } finally {
    mongoose.disconnect();
  }
}