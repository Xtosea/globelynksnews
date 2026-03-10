import { connectDB } from '@/lib/mongodb';
import Article from "@/models/Article";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { articleId } = req.body;
  await dbConnect();

  try {
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ error: "Article not found" });

    article.views += 1;
    await article.save();

    res.status(200).json({ views: article.views });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update views" });
  }
}