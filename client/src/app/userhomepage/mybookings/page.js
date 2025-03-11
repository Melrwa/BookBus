// MyBookings Component
'use client'
import { useState, useEffect } from "react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const customerId = 1; // Replace with logged-in user ID

  // Fetch user bookings
  useEffect(() => {
    const fetchBookings = async () => {
      const response = await fetch(`/api/user/bookings/${customerId}`);
      const data = await response.json();
      setBookings(data);
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.map((booking) => (
        <div key={booking.id}>
          <p>Bus: {booking.bus.route}</p>
          <p>Seat: {booking.seat_number}</p>
          <p>Status: {booking.status}</p>
          {booking.status === "pending" && (
            <button onClick={() => confirmPayment(booking.id)}>Confirm Payment</button>
          )}
          <button onClick={() => cancelBooking(booking.id)}>Cancel Booking</button>
        </div>
      ))}
    </div>
  );
}