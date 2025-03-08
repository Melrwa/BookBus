"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/bookings/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(response.data.bookings);
    } catch (err) {
      setError("Failed to fetch bookings");
    }
  };

  const handleAddReview = async (bookingId, reviewText) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/booking_reviews/",
        {
          booking_id: bookingId,
          review: reviewText,
          alert: false, // Default value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBookings(); // Refresh the bookings list
    } catch (err) {
      setError("Failed to add review");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-[#F4A900] text-3xl font-bold mb-8">Your Bookings</h1>
      {error && <p className="text-red-500">{error}</p>}
      {bookings.map((booking, index) => (
        <div
          key={index}
          className="bg-gray-900 w-3/4 md:w-2/3 lg:w-3/5 p-6 rounded-lg shadow-lg mb-6"
        >
          <div className="grid grid-cols-6 text-lg font-semibold text-[#F4A900] border-b border-gray-700 pb-3">
            <span>Bus Booked</span>
            <span>Seat No.</span>
            <span>Class</span>
            <span>From-To</span>
            <span>Date/Time</span>
            <span>Price</span>
          </div>
          <div className="grid grid-cols-6 text-lg text-white py-3">
            <span className="text-[#F4A900]">{booking.bus_id}</span>
            <span>{booking.seat_numbers}</span>
            <span>{booking.is_vip ? "VIP" : "Standard"}</span>
            <span className="text-[#F4A900]">
              {booking.origin} {'>'} {booking.destination}
            </span>
            <span>{new Date(booking.departure_time).toLocaleString()}</span>
            <span>kshs {booking.amount_paid}</span>
          </div>
          <div className="mt-4">
            <h3 className="text-[#F4A900] text-xl font-bold mb-2">Reviews</h3>
            {booking.reviews && booking.reviews.length > 0 ? (
              booking.reviews.map((review, idx) => (
                <div key={idx} className="bg-gray-800 p-3 rounded-lg mb-2">
                  <p>{review.review}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
          <div className="mt-4">
            <textarea
              placeholder="Add a review..."
              className="w-full p-2 bg-gray-800 text-white rounded-lg"
            />
            <button
              onClick={() =>
                handleAddReview(
                  booking.id,
                  document.querySelector(`textarea`).value
                )
              }
              className="bg-[#F4A900] text-black font-semibold px-4 py-2 rounded-md mt-2"
            >
              Add Review
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bookings;