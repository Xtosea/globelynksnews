import Parser from "rss-parser";
import * as cheerio from "cheerio";
import connectDB from "@/lib/mongodb";
import Article from "@/models/Article";

const parser = new Parser();

const DEFAULT_IMAGE = "https://trendingnews.globelynks.com/no-image.jpg";

const feeds = [
  { url: "https://feeds.bbci.co.uk/news/rss.xml", source: "BBC News" },
  { url: "https://www.vanguardngr.com/feed/", source: "Vanguard News" },
];

async function extractImageFromArticle(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const img =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $("article img").first().attr("src") ||
      $("img").first().attr("src");

    return img || DEFAULT_IMAGE;
  } catch (err) {
    console.log("Image extraction failed:", url);
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
          const exists = await Article.findOne({
            originalUrl: item.link,
          });

          if (exists) continue;

          let image =
            item.enclosure?.url ||
            item["media:content"]?.url ||
            item["media:thumbnail"]?.url ||
            null;

          if (!image) {
            image = await extractImageFromArticle(item.link);
          }

          await Article.create({
            title: item.title,
            content: item.contentSnippet || item.content || "",
            image: image || DEFAULT_IMAGE,
            source: feed.source,
            originalUrl: item.link,
            type: "rss",
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          });

          imported++;
        }
      } catch (err) {
        console.log("Feed error:", err.message);
      }
    }

    return Response.json({
      success: true,
      imported,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      error: "Import failed",
    });
  }
}