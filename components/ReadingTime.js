"use client";

import { useEffect, useState } from "react";

export default function ReadingTime() {
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const article = document.querySelector("article");

    if (article) {
      const text = article.innerText;
      const words = text.split(/\s+/).length;

      const minutes = Math.ceil(words / 200);
      setReadingTime(minutes);
    }
  }, []);

  if (!readingTime) return null;

  return (
    <div className="text-sm text-gray-500 mb-2">
      ⏱ {readingTime} min read
    </div>
  );
}