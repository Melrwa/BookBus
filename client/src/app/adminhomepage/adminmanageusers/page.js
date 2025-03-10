"use client";

import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa"; // User avatar icon

const ViewAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users"); // No auth token

        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }

        const data = await response.json();
        console.log("Fetched Users:", data); // Debugging

        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <p className="text-gray-400 mt-4">Loading users...</p>;
  }

  if (error) {
    return <p className="text-red-500 mt-4">{error}</p>;
  }

  return (
    <div className="p-6 bg-black text-white min-h-screen flex flex-col items-center">
      <h2 className="text-yellow-500 text-3xl font-bold mb-6">All Users</h2>
      {users.length === 0 ? (
        <p className="text-gray-400">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-6xl">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-900 p-4 rounded-2xl shadow-lg flex items-center space-x-4 border border-gray-700 hover:bg-gray-800 transition"
            >
              <FaUserCircle className="text-yellow-500 text-5xl" />
              <div>
                <p className="text-lg font-semibold text-yellow-400">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
                <p className="text-xs text-gray-500 uppercase">{user.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAllUsers;
