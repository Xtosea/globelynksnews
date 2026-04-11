"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() { const [news, setNews] = useState([]); const [selected, setSelected] = useState([]); const [loading, setLoading] = useState(true);

// Edit state const [editingItem, setEditingItem] = useState(null); const [shortSummary, setShortSummary] = useState(""); const [whyItMatters, setWhyItMatters] = useState("");

useEffect(() => { fetchNews(); }, []);

const fetchNews = async () => { setLoading(true); const res = await fetch("/api/news"); const data = await res.json(); setNews(data); setLoading(false); };

const toggleSelect = (id) => { setSelected((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id] ); };

const deleteOne = async (id) => {
  await fetch(`/api/news/${id}`, {
    method: "DELETE",
  });

  setNews(news.filter((n) => n._id !== id));
};

const deleteSelected = async () => { if (selected.length === 0) return;

await fetch("/api/news/bulk-delete", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ids: selected }),
});

setNews(news.filter((n) => !selected.includes(n._id)));
setSelected([]);

};

// Open edit modal const openEdit = (item) => { setEditingItem(item); setShortSummary(item.shortSummary || ""); setWhyItMatters(item.whyItMatters || ""); };

// Save edit const saveEdit = async () => { if (!editingItem) return;

await fetch(`/api/news/${editingItem._id}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ shortSummary, whyItMatters }),
});

setNews((prev) =>
  prev.map((n) =>
    n._id === editingItem._id
      ? { ...n, shortSummary, whyItMatters }
      : n
  )
);

setEditingItem(null);

};

return ( <div className="min-h-screen bg-gray-100 p-6"> {/* Header */} <div className="flex justify-between items-center mb-6"> <h1 className="text-2xl font-bold">Admin News Dashboard</h1>

<button
      onClick={deleteSelected}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      Delete Selected ({selected.length})
    </button>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-3 gap-4 mb-6">
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500">Total News</p>
      <h2 className="text-xl font-bold">{news.length}</h2>
    </div>
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500">Selected</p>
      <h2 className="text-xl font-bold">{selected.length}</h2>
    </div>
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500">Status</p>
      <h2 className="text-green-600 font-bold">Active</h2>
    </div>
  </div>

  {/* News List */}
  <div className="bg-white rounded-xl shadow p-4">
    {loading ? (
      <p>Loading news...</p>
    ) : (
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item._id} className="border-b pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(item._id)}
                  onChange={() => toggleSelect(item._id)}
                />

                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.shortSummary || item.description}
                  </p>

                  <p className="text-xs text-blue-500">
                    Source: {item.source || "Unknown"}
                  </p>

                  {item.whyItMatters && (
                    <p className="text-xs text-gray-600 mt-1">
                      <b>Why It Matters:</b> {item.whyItMatters}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteOne(item._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* EDIT MODAL */}
  {editingItem && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">Edit News</h2>

        <textarea
          className="w-full border p-2 mb-3"
          placeholder="Short Summary"
          value={shortSummary}
          onChange={(e) => setShortSummary(e.target.value)}
        />

        <textarea
          className="w-full border p-2 mb-3"
          placeholder="Why It Matters"
          value={whyItMatters}
          onChange={(e) => setWhyItMatters(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditingItem(null)}
            className="px-3 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={saveEdit}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}
</div>

); }