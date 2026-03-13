// utils/cacheImage.js
import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // or global fetch if Node 20+

export async function cacheImage(url, slug) {
  try {
    if (!url) return null;

    const res = await fetch(url);
    if (!res.ok) return null;

    const ext = path.extname(new URL(url).pathname) || ".jpg";
    const filename = `${slug}${ext}`;
    const dir = path.join(process.cwd(), "public", "news-images");

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, filename);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Return the URL that can be used in browser
    return `/news-images/${filename}`;
  } catch (err) {
    console.error("Image caching failed:", err.message);
    return null;
  }
}