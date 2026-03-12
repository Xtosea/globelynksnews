import Parser from "rss-parser";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";

const parser = new Parser();

const feeds = [

  // Nigeria
  "https://punchng.com/feed/",
  "https://www.vanguardngr.com/feed/",
  "https://guardian.ng/feed/",
  "https://www.channelstv.com/feed/",

  // Africa
  "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
  "https://www.africanews.com/feed/rss",

  // World
  "https://feeds.bbci.co.uk/news/rss.xml",
  "http://rss.cnn.com/rss/edition.rss",

  // Tech
  "https://techcrunch.com/feed/"
];

export async function GET() {

  try {

    await connectDB();

    let imported = 0;

    for (const feedUrl of feeds) {

      const feed = await parser.parseURL(feedUrl);

      for (const item of feed.items) {

        const exists = await Article.findOne({
          originalUrl: item.link
        });

        if (exists) continue;

        await Article.create({
          title: item.title,
          content: item.contentSnippet || "",
          originalUrl: item.link,
          source: feed.title,
          image: item.enclosure?.url || "",
          type: "rss",
          publishedAt: item.pubDate || new Date()
        });

        imported++;
      }
    }

    return Response.json({
      success: true,
      imported
    });

  } catch (error) {

    console.error("Import error:", error);

    return Response.json({
      success: false,
      error: error.message
    });
  }
}