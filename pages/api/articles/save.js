import { connectDB } from '@/lib/mongodb';
import Article from "@/models/Article";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  await dbConnect();

  try {
    const articles = req.body.articles;
    const saved = await Article.insertMany(articles, { ordered: false }); // skips duplicates
    res.status(200).json({ message: "Articles saved", saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save articles" });
  }
}