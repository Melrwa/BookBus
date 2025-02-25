"use client";

import React from "react";

const reviews = [
  {
    user: "Kimutai",
    rating: 5,
    comment: "Great experience! The booking process was smooth.",
    date: "25/02/25",
  },
  {
    user: "Shirleen",
    rating: 4,
    comment: "Good service but could be improved.",
    date: "19/02/25",
  },
];

const ReviewsTable = () => {
  return (
    <div className="p-6 bg-black text-white min-h-screen flex flex-col items-center">
      <h2 className="text-yellow-500 text-2xl font-bold mb-4">
        Customer Reviews
      </h2>
      <div className="w-full max-w-1xl border border-gray-700">
        <div className="grid grid-cols-3 bg-gray-800 text-yellow-500 font-bold p-5">
          <div>User</div>
          <div>Comment</div>
          <div>Date</div>
        </div>
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`grid grid-cols-3 p-5 ${
              index % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
            } border-b border-gray-700`}
          >
            <div>{review.user}</div>
            <div>{review.comment}</div>
            <div>{review.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTable;
