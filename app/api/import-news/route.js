import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";

const parser = new Parser();
const DEFAULT_IMAGE = "https://trendingnews.globelynks.com/no-image.jpg";

// Popular news feeds
const feeds = [
  { url: "https://feeds.bbci.co.uk/news/rss.xml", source: "BBC News" },
  { url: "https://www.vanguardngr.com/feed/", source: "Vanguard News" },
  { url: "https://www.premiumtimesng.com/feed", source: "Premium Times" },
  { url: "https://www.theguardian.com/world/rss", source: "The Guardian" },
  { url: "https://www.cnn.com/rss/edition.rss", source: "CNN" },
  { url: "https://feeds.nytimes.com/nyt/rss/HomePage", source: "NY Times" },
  { url: "https://www.aljazeera.com/xml/rss/all.xml", source: "Al Jazeera" },
  { url: "https://www.reutersagency.com/feed/?best-topics=top-news", source: "Reuters" },
];

// Extract largest/first meaningful image from article page
async function extractImageFromArticle(url) {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await res.text();
    const $ = cheerio.load(html);

    // Collect candidate images
    const candidates = [
      $('meta[property="og:image"]').attr("content"),
      $('meta[name="twitter:image"]').attr("content"),
      $("article img").map((i, el) => $(el).attr("src")).get(),
      $("figure img").map((i, el) => $(el).attr("src")).get(),
      $(".td-post-featured-image img").map((i, el) => $(el).attr("src")).get(),
      $("img").map((i, el) => $(el).attr("src")).get(),
    ].flat().filter(Boolean);

    // Optional: pick largest by fetching width/height (if needed)
    return candidates[0] || DEFAULT_IMAGE;
  } catch (err) {
    console.log("Image extraction failed:", url, err.message);
    return DEFAULT_IMAGE;
  }
}

export async function GET() {
  try {
    await connectDB();
    let imported = 0;

    for (const feed of feeds) {
      try {
        const parsed = await parser.parseURL(feed.url);

        for (const item of parsed.items) {
          // Deduplicate by URL or title
          const exists = await Article.findOne({
            $or: [{ originalUrl: item.link }, { title: item.title }],
          });
          if (exists) continue;

          // Feed image or extract from page
          let image =
            item.enclosure?.url ||
            item["media:content"]?.url ||
            item["media:thumbnail"]?.url ||
            null;

          if (!image) image = await extractImageFromArticle(item.link);

          await Article.create({
            title: item.title,
            content: item.contentSnippet || item.content || "",
            image: image || DEFAULT_IMAGE,
            source: feed.source,
            originalUrl: item.link,
            type: "rss",
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
            categories: item.categories || [],
          });

          imported++;
        }
      } catch (err) {
        console.log("Feed error:", feed.source, err.message);
      }
    }

    return Response.json({ success: true, imported });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: "Import failed" });
  }
}