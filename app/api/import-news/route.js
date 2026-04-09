import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";

const parser = new Parser();

const DEFAULT_IMAGE =
  "https://trendingnews.globelynks.com/no-image.jpg";

/* ================================
   Smart Category Detection
================================ */
function detectCategory(title, content, fallback) {
  const text = `${title} ${content}`.toLowerCase();

  if (
    text.includes("election") ||
    text.includes("president") ||
    text.includes("senate") ||
    text.includes("governor") ||
    text.includes("minister") ||
    text.includes("politics")
  )
    return "politics";

  if (
    text.includes("football") ||
    text.includes("match") ||
    text.includes("goal") ||
    text.includes("sports") ||
    text.includes("premier league")
  )
    return "sports";

  if (
    text.includes("tech") ||
    text.includes("ai") ||
    text.includes("technology") ||
    text.includes("startup")
  )
    return "technology";

  if (
    text.includes("business") ||
    text.includes("market") ||
    text.includes("economy") ||
    text.includes("bank")
  )
    return "business";

  if (
    text.includes("music") ||
    text.includes("movie") ||
    text.includes("celebrity") ||
    text.includes("entertainment")
  )
    return "entertainment";

  if (
    text.includes("nigeria") ||
    text.includes("lagos") ||
    text.includes("abuja") ||
    text.includes("tinubu")
  )
    return "nigeria";

  return fallback || "world";
}

/* ================================
   RSS Feeds
================================ */

const feeds = [
  {
    url: "https://feeds.bbci.co.uk/news/rss.xml",
    source: "BBC News",
    category: "world",
  },

  {
    url: "https://www.vanguardngr.com/feed/",
    source: "Vanguard",
    category: "nigeria",
  },

  {
    url: "https://www.premiumtimesng.com/feed",
    source: "Premium Times",
    category: "nigeria",
  },

  {
    url: "https://www.theguardian.com/world/rss",
    source: "Guardian",
    category: "world",
  },

  {
    url: "https://www.cnn.com/rss/edition.rss",
    source: "CNN",
    category: "world",
  },

  {
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    source: "Al Jazeera",
    category: "world",
  },

  {
    url: "https://www.espn.com/espn/rss/news",
    source: "ESPN",
    category: "sports",
  },

  {
    url: "https://feeds.feedburner.com/TechCrunch",
    source: "TechCrunch",
    category: "technology",
  },

  {
    url: "https://www.goal.com/feeds/en/news",
    source: "Goal",
    category: "sports",
  },
];

/* ================================
   Extract Image
================================ */

async function extractImageFromArticle(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const image =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      $("article img")
        .not("[width='1']")
        .not("[height='1']")
        .first()
        .attr("src") ||
      $("img")
        .not("[width='1']")
        .not("[height='1']")
        .first()
        .attr("src");

    return image || DEFAULT_IMAGE;
  } catch (err) {
    console.log("Image extraction failed:", url);
    return DEFAULT_IMAGE;
  }
}

/* ================================
   Clean Content
================================ */

function cleanSummary(item) {
  const raw =
    item.contentSnippet ||
    item.content ||
    item.summary ||
    "";

  return raw
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 220);
}

/* ================================
   Import News
================================ */

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

          const summary = cleanSummary(item);

          const category = detectCategory(
            item.title,
            summary,
            feed.category
          );

          await Article.create({
            title: item.title,
            content: summary,
            image: image || DEFAULT_IMAGE,
            source: feed.source,
            category,
            originalUrl: item.link,
            type: "rss",
            publishedAt: item.pubDate
              ? new Date(item.pubDate)
              : new Date(),
          });

          imported++;
        }
      } catch (err) {
        console.log(
          "Feed error:",
          feed.source,
          err.message
        );
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