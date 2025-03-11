"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Updated import for App Router


export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState("");
  const router = useRouter();

  // Replace with the logged-in user's ID (you can fetch this from your authentication system)
  const customerId = 2; // Example: Hardcoded for now

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/user/bookings/${customerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bookings.");
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchBookings();
  }, [customerId]);

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await fetch(`/user/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to cancel booking.");
      }
      // Remove the canceled booking from the list
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      alert("Booking canceled successfully!");
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert("Failed to cancel booking.");
    }
  };

  // Handle payment confirmation for pending bookings
  const handleConfirmPayment = async (bookingId) => {
    router.push(`/confirm-payment?bookingId=${bookingId}`);
  };

  // Show loading state while fetching bookings
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Show error message if fetching bookings fails
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-400">No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-gray-900 p-6 rounded-lg border border-gray-800"
            >
              <h2 className="text-xl font-semibold text-yellow-500">
                Booking ID: {booking.id}
              </h2>
              <p className="text-gray-400">
                Bus: {booking.bus?.route || "N/A"}
              </p>
              <p className="text-gray-400">
                Seat Number: {booking.seat_number}
              </p>
              <p className="text-gray-400">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    booking.status === "confirmed"
                      ? "text-green-500"
                      : booking.status === "pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {booking.status}
                </span>
              </p>
              <p className="text-gray-400">
                Booking Date:{" "}
                {new Date(booking.booking_date).toLocaleString()}
              </p>
              <div className="mt-4 flex gap-2">
                {booking.status === "pending" && (
                  <button
                    onClick={() => handleConfirmPayment(booking.id)}
                    className="bg-green-500 px-4 py-2 rounded-lg text-white"
                  >
                    Confirm Payment
                  </button>
                )}
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="bg-red-500 px-4 py-2 rounded-lg text-white"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}