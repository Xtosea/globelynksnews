"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return; // Important: wait until id exists

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        if (!res.ok) return alert(data.message || "Post not found");
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setSaving(true);

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Failed to save post");

      alert("Post updated successfully!");
      router.push("/admin/posts");
    } catch (err) {
      console.error(err);
      alert("Server error.");
    } finally {
      setSaving(false);
    }
  };

  if (!id) return null; // Prevent prerender crash
  if (loading) return <p className="px-6 py-10">Loading post...</p>;
  if (!post) return <p className="px-6 py-10">Post not found.</p>;

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

        <form onSubmit={handleSave} className="space-y-5">
          <input
            name="title"
            value={post.title}
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <textarea
            name="content"
            value={post.content}
            rows="8"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}