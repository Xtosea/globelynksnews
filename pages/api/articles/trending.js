import { connectDB } from "@/lib/mongodb"
import Article from "@/models/Article"

export const config = {
  runtime: "nodejs",
}

export default async function handler(req, res) {
  try {
    await connectDB()

    const topArticles = await Article.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("title slug image createdAt source originalUrl category")
      .lean()

    const categoryCount = await Article.aggregate([
      { $match: { published: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Add cache headers (VERY IMPORTANT)
    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=59"
    )

    res.status(200).json({ topArticles, categoryCount })
  } catch (err) {
    console.error("Error fetching trending articles:", err)
    res.status(500).json({ error: "Failed to fetch trending articles" })
  }
}