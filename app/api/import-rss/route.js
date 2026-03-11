import { NextResponse } from "next/server";
import RSSParser from "rss-parser";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";

const RSS_FEEDS = [
  { url: "import { NextResponse } from "next/server";
import RSSParser from "rss-parser";
import { connectDB } from "@/lib/mongodb";
import Article from "@/models/Article";

const RSS_FEEDS = [
  { url: "https://techcrunch.com/feed/", source: "TechCrunch" },
  { url: "http://feeds.bbci.co.uk/news/rss.xml", source: "BBC News" },
  { url: "http://rss.cnn.com/rss/edition.rss", source: "CNN" },
];

export async function GET(req) {

  // 🔒 Protect cron endpoint
  if (
    req.headers.get("authorization") !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {

    await connectDB();

    const parser = new RSSParser();

    let importedCount = 0;

    for (const feedInfo of RSS_FEEDS) {

      console.log(`Fetching: ${feedInfo.source}`);

      try {

        const feed = await parser.parseURL(feedInfo.url);

        const items = feed.items.slice(0, 15);

        for (const item of items) {

          // check duplicate
          const exists = await Article.findOne({
            originalUrl: item.link,
          });

          if (exists) continue;

          // generate slug
          const slug = item.title
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          await Article.create({

            title: item.title || "Untitled",

            slug,

            excerpt: item.contentSnippet || "",

            content: item.content || item.contentSnippet || "",

            image:
              item.enclosure?.url ||
              item["media:content"]?.url ||
              "",

            category: item.categories?.[0] || "General",

            source: feedInfo.source,

            originalUrl: item.link || "",

            type: "rss",

            views: 0,

            published: true,

            createdAt: item.pubDate
              ? new Date(item.pubDate)
              : new Date(),
          });

          importedCount++;

          console.log(
            `Imported: ${item.title} (${feedInfo.source})`
          );

        }

      } catch (feedError) {

        console.error(
          `Error with ${feedInfo.source}:`,
          feedError.message
        );

      }

    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
    });

  } catch (error) {

    console.error("RSS Import Error:", error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );

  }
}", source: "TechCrunch" },
  { url: "http://feeds.bbci.co.uk/news/rss.xml", source: "BBC News" },
  { url: "http://rss.cnn.com/rss/edition.rss", source: "CNN" },
];

export async function GET(req) {
  // 🔒 Protect cron endpoint
  if (
    req.headers.get("authorization") !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const parser = new RSSParser();

    let importedCount = 0;

    for (const feedInfo of RSS_FEEDS) {
      console.log(`Fetching: ${feedInfo.source}`);

      try {
        const feed = await parser.parseURL(feedInfo.url);

        // ✅ Limit to latest 15 articles per feed
        const items = feed.items.slice(0, 15);

        for (const item of items) {
          // ✅ Check duplicate by originalUrl (better than title)
          const exists = await Article.findOne({
            originalUrl: item.link,
          });

          if (exists) continue;

          await Article.create({
            title: item.title,
            content:
              item.content || item.contentSnippet || "",
            type: "rss",
            category:
              item.categories?.[0] || "General",
            image: item.enclosure?.url || "",
            source: feedInfo.source,
            originalUrl: item.link || "",
            views: 0,
            published: true,
            createdAt: item.pubDate
              ? new Date(item.pubDate)
              : new Date(),
          });

          importedCount++;
          console.log(
            `Imported: ${item.title} (${feedInfo.source})`
          );
        }
      } catch (feedError) {
        console.error(
          `Error with ${feedInfo.source}:`,
          feedError.message
        );
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
    });
  } catch (error) {
    console.error("RSS Import Error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}