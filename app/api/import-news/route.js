import mongoose from "mongoose";
import Parser from "rss-parser";
import * as cheerio from "cheerio";
import slugify from "slugify";
import Article from "@/models/Article";

const parser = new Parser();

const DEFAULT_IMAGE =
  "https://trendingnews.globelynks.com/no-image.jpg";

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;

  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB connected");
}

// Extract image from RSS
function extractImage(item) {
  let image = null;

  // enclosure
  if (item.enclosure?.url) {
    image = item.enclosure.url;
  }

  // media:content
  else if (item["media:content"]?.url) {
    image = item["media:content"].url;
  }

  // media:thumbnail
  else if (item["media:thumbnail"]?.url) {
    image = item["media:thumbnail"].url;
  }

  // Extract image from HTML content
  else if (item.content || item.contentSnippet) {
    const html = item.content || item.contentSnippet;
    const $ = cheerio.load(html);
    const img = $("img").first().attr("src");

    if (img) image = img;
  }

  // Fix relative URLs
  if (image && image.startsWith("/")) {
    try {
      image = new URL(image, item.link).href;
    } catch {
      image = DEFAULT_IMAGE;
    }
  }

  return image || DEFAULT_IMAGE;
}

// RSS feed list
const feeds = [
  { url: "https://rss.cnn.com/rss/edition.rss", category: "World" },
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "World" },
  { url: "https://www.punchng.com/feed/", category: "Nigeria" },
];

// Import feeds
async function importFeeds() {
  await connectDB();

  for (const feedInfo of feeds) {
    try {
      const feed = await parser.parseURL(feedInfo.url);

      console.log("Importing:", feed.title);

      for (const item of feed.items) {
        const slug = slugify(item.title || "", {
          lower: true,
          strict: true,
        });

        const image = extractImage(item);

        try {
          const exists = await Article.findOne({ slug });

          if (exists) {
            console.log("Skipped duplicate:", item.title);
            continue;
          }

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

          console.log("Imported:", item.title);
        } catch (err) {
          console.error("Error saving:", err.message);
        }
      }
    } catch (err) {
      console.error("Feed failed:", feedInfo.url, err.message);
    }
  }

  console.log("All feeds processed");
}

importFeeds();