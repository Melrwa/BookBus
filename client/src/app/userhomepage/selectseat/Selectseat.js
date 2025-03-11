"use client";

import { useState, useEffect } from "react";

export default function SelectSeats() {
  const [selectedSeat, setSelectedSeat] = useState(null); // Track the selected seat
  const [showForm, setShowForm] = useState(false); // Control form visibility
  const [customerId, setCustomerId] = useState(""); // Keep only customerId
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dummy list of available seats (replace with your actual data)
  const availableSeats = Array.from({ length: 20 }, (_, i) => i + 1);

  // Handle seat selection
  const handleSelectSeat = (seat) => {
    setSelectedSeat(seat);
    setShowForm(true); // Show the form when a seat is selected
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form inputs
    if (!customerId || !selectedSeat) {
      setError("Please fill in all fields and select a seat.");
      return;
    }
  
    const bookingData = {
      customer_id: customerId,
      bus_id: 1, // Replace with the actual bus ID (e.g., from the URL or state)
      seat_number: selectedSeat,
    };
  
    console.log("Booking Data:", bookingData); // Log the booking data
  
    try {
      const response = await fetch("/api/simple-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to book seat.");
      }
  
      const data = await response.json();
  
      // Reset form and show success message
      setCustomerId("");
      setSelectedSeat(null);
      setShowForm(false);
      setSuccess("Booking successful!");
      setError("");
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message);
    }
  };

  // Use useEffect to automatically clear the success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }
  }, [success]);

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">Select Seats</h1>

      {/* Seat Selection Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {availableSeats.map((seat) => (
          <button
            key={seat}
            onClick={() => handleSelectSeat(seat)}
            className={`p-4 rounded-lg text-center ${
              selectedSeat === seat
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {seat}
          </button>
        ))}
      </div>

      {/* Booking Form Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Book Seat {selectedSeat}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-yellow-500 mb-2">Your ID</label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  placeholder="Enter your ID"
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 px-4 py-2 rounded"
                >
                  Book Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Message Popup */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg">
          {success}
        </div>
      )}
    </div>
  );
}