"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/booking_reviews/?page=${page}&per_page=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data.reviews);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError("Failed to fetch reviews");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-[#F4A900] text-3xl font-bold mb-8">All Reviews</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="w-full max-w-4xl">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-gray-900 p-6 rounded-lg shadow-lg mb-6"
          >
            <p>{review.review}</p>
            <p className="text-sm text-gray-400">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              page === i + 1
                ? "bg-[#F4A900] text-black"
                : "bg-gray-700 text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;