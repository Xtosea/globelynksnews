import Parser from "rss-parser";

const parser = new Parser();

export default async function handler(req, res) {
  const feeds = [
    { url: "https://feeds.bbci.co.uk/news/politics/rss.xml", category: "Politics" },
    { url: "https://www.reutersagency.com/feed/?best-topics=technology", category: "Tech" },
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "International" },
    { url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml", category: "Entertainment" },
  ];

  try {
    let allItems = [];

    for (let f of feeds) {
      const feed = await parser.parseURL(f.url);
      const items = feed.items.map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        source: feed.title,
        snippet: item.contentSnippet,
        category: f.category,
      }));
      allItems = allItems.concat(items);
    }

    allItems.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    res.status(200).json({ news: allItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch RSS feeds" });
  }
}