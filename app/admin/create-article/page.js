"use client";
import { useState } from "react";
import BreakingNewsPanel from "@/components/BreakingNewsPanel";

export default function CreateArticle() {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleSelectNews(selectedItems) {
    const prepared = selectedItems.map(item => ({
      title: item.title,
      content: item.snippet + "\n\n[Write your original content here]",
      source: item.source,
      category: item.category,
      tags: [],
      scheduledDate: new Date().toISOString(),
      published: false,
    }));
    setArticles(prepared);
    setCurrentIndex(0);
  }

  function handleChangeField(field, value) {
    const updated = [...articles];
    updated[currentIndex][field] = value;
    setArticles(updated);
  }

  async function handleSave() {
    const res = await fetch("/api/articles/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articles }),
    });

    if (res.ok) alert(`Saved ${articles.length} articles! They will auto-publish.`);
    else alert("Failed to save articles");
  }

  if (articles.length === 0) return <BreakingNewsPanel onSelect={handleSelectNews} />;

  const article = articles[currentIndex];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Articles ({currentIndex + 1}/{articles.length})</h1>

      <input type="text" value={article.title} onChange={e => handleChangeField("title", e.target.value)} placeholder="Title" className="w-full p-2 border mb-2" />
      <textarea value={article.content} onChange={e => handleChangeField("content", e.target.value)} placeholder="Content" className="w-full p-2 border h-40 mb-2" />
      <input type="text" value={article.source} onChange={e => handleChangeField("source", e.target.value)} placeholder="Source" className="w-full p-2 border mb-2" />
      <input type="text" value={article.category} onChange={e => handleChangeField("category", e.target.value)} placeholder="Category" className="w-full p-2 border mb-2" />
      <input type="text" value={article.tags.join(",")} onChange={e => handleChangeField("tags", e.target.value.split(","))} placeholder="Tags" className="w-full p-2 border mb-2" />
      <input type="datetime-local" value={article.scheduledDate.slice(0,16)} onChange={e => handleChangeField("scheduledDate", e.target.value)} className="w-full p-2 border mb-2" />

      <div className="flex justify-between mt-2">
        <button onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex-1)} className="px-4 py-2 bg-gray-500 text-white rounded">Prev</button>
        <button onClick={() => currentIndex < articles.length-1 && setCurrentIndex(currentIndex+1)} className="px-4 py-2 bg-gray-500 text-white rounded">Next</button>
      </div>

      <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Save & Schedule All</button>
    </div>
  );
}