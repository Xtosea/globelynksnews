"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      if (res.ok) setUsers(data);
      else alert(data.message || "Failed to fetch users");
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="w-full table-auto border">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      onClick={async () => {
                        if (!confirm("Delete this user?")) return;
                        const res = await fetch(`/api/users/${user._id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                        });
                        const data = await res.json();
                        if (!res.ok) return alert(data.message || "Delete failed");
                        fetchUsers();
                      }}
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