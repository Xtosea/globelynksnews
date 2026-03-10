"use client";
import { useEffect, useState } from "react";

export default function BreakingNewsPanel({ onSelect }) {
  const [news, setNews] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch("/api/rss/fetch")
      .then(res => res.json())
      .then(data => setNews(data.news));
  }, []);

  const toggleSelect = (item) => {
    const exists = selected.find(i => i.link === item.link);
    if (exists) {
      setSelected(selected.filter(i => i.link !== item.link));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <div>
      <h2>Breaking News Suggestions</h2>
      <ul>
        {news.map((item, i) => (
          <li key={i} className="mb-4 border-b pb-2">
            <div className="flex justify-between items-start">
              <div>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600">
                  {item.title}
                </a>
                <p>{item.snippet}</p>
                <small>{item.source} | {new Date(item.pubDate).toLocaleString()} | {item.category}</small>
              </div>
              <button
                className={`px-3 py-1 rounded ${selected.find(i => i.link === item.link) ? 'bg-red-500' : 'bg-green-500'} text-white`}
                onClick={() => toggleSelect(item)}
              >
                {selected.find(i => i.link === item.link) ? "Deselect" : "Add"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selected.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => onSelect(selected)}
        >
          Create Articles for {selected.length} Items
        </button>
      )}
    </div>
  );
}