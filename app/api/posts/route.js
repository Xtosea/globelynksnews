await Article.create({
  title: item.title,

  slug: item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-"),

  excerpt: item.contentSnippet || "",

  content: item.content || "",

  image: item.enclosure?.url || "",

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