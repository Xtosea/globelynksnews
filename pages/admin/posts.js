"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchPosts();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Delete failed");

      // Refresh posts
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Server error. Check console.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Manage Posts</h1>

        {loading ? (
          <p>Loading posts...</p>
        ) : posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-t">
                  <td className="px-4 py-2">{post.title}</td>
                  <td className="px-4 py-2">{post.category}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() => router.push(`/admin/edit-post/${post._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(post._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}