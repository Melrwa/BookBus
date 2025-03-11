"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function SelectSeats() {
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter();
  const busId = router.query.busId; // Get busId from query


  // Fetch available seats
  useEffect(() => {
    if (!busId) return; // Exit if busId is not yet available

    const fetchAvailableSeats = async () => {
      try {
        const response = await fetch(`/api/buses/${busId}/seats`);
        const data = await response.json();
        setAvailableSeats(data.available_seats);
      } catch (err) {
        console.error("Failed to fetch available seats:", err);
      }
    };

    fetchAvailableSeats();
  }, [busId]);

  // Fetch bus details
  useEffect(() => {
    if (!busId) return; // Exit if busId is not yet available

    const fetchBusDetails = async () => {
      try {
        const response = await fetch(`/api/buses/${busId}`);
        const data = await response.json();
        setBus(data);
      } catch (err) {
        console.error("Failed to fetch bus details:", err);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchBusDetails();
  }, [busId]);

  // Handle seat selection
  const handleSelectSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  // Calculate total amount
  useEffect(() => {
    if (bus) {
      setTotalAmount(selectedSeats.length * bus.cost_per_seat);
    }
  }, [selectedSeats, bus]);

  // Handle booking submission
  const handleBookSeats = async () => {
    try {
      const response = await fetch("/api/bookings/multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: 1, // Replace with logged-in user ID
          bus_id: busId,
          seat_numbers: selectedSeats,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        router.push(`/userhomepage/confirmpayment?bookingId=${data.bookings[0].id}`);
      } else {
        alert("Failed to book seats.");
      }
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  // Show loading state while waiting for busId
  if (!busId || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">Select Seats</h1>
      <div className="grid grid-cols-4 gap-4">
        {availableSeats.map((seat) => (
          <button
            key={seat}
            onClick={() => handleSelectSeat(seat)}
            className={`p-4 rounded-lg text-center ${
              selectedSeats.includes(seat)
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {seat}
          </button>
        ))}
      </div>
      <div className="mt-6">
        <p className="text-xl font-semibold text-yellow-500">
          Total Amount: Ksh {totalAmount.toFixed(2)}
        </p>
        <button
          onClick={handleBookSeats}
          className="mt-4 bg-red-500 px-6 py-2 rounded-lg text-white"
        >
          Book Seats
        </button>
      </div>
    </div>
  );
}