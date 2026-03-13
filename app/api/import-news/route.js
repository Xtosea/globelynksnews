import Parser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import Article from "@/models/Article.js";

const parser = new Parser();

const DEFAULT_IMAGE = "https://trendingnews.globelynks.com/no-image.jpg";

const feeds = [
  { url: "https://feeds.bbci.co.uk/news/rss.xml", source: "BBC News" },
  { url: "https://www.vanguardngr.com/feed/", source: "Vanguard News" },
];

async function extractImageFromArticle(url) {
  try {
    const { data } = await axios.get(url, { timeout: 8000 });

    const $ = cheerio.load(data);

    const img =
      $('meta[property="og:image"]').attr("content") ||
      $("article img").first().attr("src") ||
      $("img").first().attr("src");

    return img || DEFAULT_IMAGE;
  } catch (err) {
    return DEFAULT_IMAGE;
  }
}

export async function importRSS() {
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

        const article = new Article({
          title: item.title,
          content: item.contentSnippet || item.content || "",
          image: image || DEFAULT_IMAGE,
          source: feed.source,
          originalUrl: item.link,
          type: "rss",
          publishedAt: item.pubDate || new Date(),
        });

        await article.save();
      }
    } catch (err) {
      console.error("RSS error:", err.message);
    }
  }
}