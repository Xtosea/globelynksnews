import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateNewsSummary(title, description) {
  const prompt = `
You are a professional news editor.

Rewrite the news into:

1. A short summary (2–3 sentences)
2. Why this matters (1–2 sentences)

News Title: ${title}
News Description: ${description}

Return ONLY JSON like:
{
  "shortSummary": "...",
  "whyItMatters": "..."
}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content);
}