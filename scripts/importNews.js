import Parser from "rss-parser";
import axios from "axios";
import cheerio from "cheerio";
import { connectDB } from "../lib/mongodb.js";
import Article from "../models/Article.js";

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure']
    ]
  }
});

const feeds = [

  // GLOBAL
  {
    url: "https://feeds.bbci.co.uk/news/rss.xml",
    category: "World"
  },
  {
    url: "http://rss.cnn.com/rss/edition.rss",
    category: "World"
  },

  // AFRICA
  {
    url: "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
    category: "Africa"
  },
  {
    url: "https://www.africanews.com/feed/rss",
    category: "Africa"
  },
  {
    url: "https://allafrica.com/tools/headlines/rdf/latest/headlines.rdf",
    category: "Africa"
  },

  // NIGERIA
  {
    url: "https://www.vanguardngr.com/feed/",
    category: "Nigeria"
  },
  {
    url: "https://punchng.com/feed/",
    category: "Nigeria"
  },
  {
    url: "https://guardian.ng/feed/",
    category: "Nigeria"
  },
  {
    url: "https://www.channelstv.com/feed/",
    category: "Nigeria"
  },
  {
    url: "https://www.premiumtimesng.com/feed",
    category: "Nigeria"
  },

  // TECH
  {
    url: "https://techcrunch.com/feed/",
    category: "Technology"
  }
];

async function getOgImage(url) {
  try {
    const { data } = await axios.get(url, { timeout: 5000 });
    const $ = cheerio.load(data);

    const og =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content");

    return og || "";
  } catch {
    return "";
  }
}

async function importNews() {

  await connectDB();

  for (const feedSource of feeds) {

    console.log("Fetching:", feedSource.url);

    const feed = await parser.parseURL(feedSource.url);

    for (const item of feed.items) {

      const exists = await Article.findOne({
        originalUrl: item.link
      });

      if (exists) continue;

      let image =
        item.mediaContent?.url ||
        item.mediaThumbnail?.url ||
        item.enclosure?.url ||
        "";

      if (!image) {
        image = await getOgImage(item.link);
      }

      await Article.create({
        title: item.title,
        content: item.contentSnippet || "",
        originalUrl: item.link,
        source: feed.title,
        image: image,
        category: feedSource.category,
        type: "rss",
        publishedAt: item.pubDate || new Date(),
        createdAt: new Date()
      });

      console.log("Saved:", item.title);
    }
  }

  console.log("Import finished");
}

importNews();