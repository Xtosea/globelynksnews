import mongoose from "mongoose";
import Parser from "rss-parser";
import cheerio from "cheerio";
import slugify from "slugify";
import Article from "../models/Article.js";

const parser = new Parser();
const DEFAULT_IMAGE = "https://trendingnews.globelynks.com/no-image.jpg";

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/newsdb";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Extract image from RSS item
function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item["media:content"]?.url) return item["media:content"].url;
  if (item["media:thumbnail"]?.url) return item["media:thumbnail"].url;

  // Extract first image from content HTML
  if (item.content || item.contentSnippet) {
    const html = item.content || item.contentSnippet;
    const $ = cheerio.load(html);
    const img = $("img").first().attr("src");
    if (img) return img;
  }

  // Fallback default
  return DEFAULT_IMAGE;
}

// RSS feed list
const feeds = [
  { url: "https://rss.cnn.com/rss/edition.rss", category: "World" },
  { url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "World" },
  { url: "https://www.punchng.com/feed/", category: "Nigeria" }
];

// Import all feeds
async function importFeeds() {
  for (const feedInfo of feeds) {
    try {
      const feed = await parser.parseURL(feedInfo.url);
      console.log(`Importing feed: ${feed.title}`);

      for (const item of feed.items) {
        const image = extractImage(item);
        const slug = slugify(item.title, { lower: true, strict: true });

        try {
          await Article.create({
            title: item.title,
            content: item.contentSnippet || "",
            image,
            originalUrl: item.link,
            source: feed.title,
            slug,
            category: feedInfo.category
          });
          console.log("Imported:", item.title);
        } catch (err) {
          if (err.code === 11000) console.log("Skipped duplicate:", item.title);
          else console.error("Error importing:", item.title, err.message);
        }
      }
    } catch (err) {
      console.error("Failed to fetch feed:", feedInfo.url, err.message);
    }
  }

  console.log("All feeds processed");
  mongoose.disconnect();
}

importFeeds();