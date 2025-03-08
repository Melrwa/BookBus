"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Adminmanagebookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/bookings/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBookings(response.data.bookings);
    } catch (err) {
      setError('Failed to fetch bookings');
    }
  };

  const handleDelete = async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchAllBookings(); // Refresh the list after deletion
    } catch (err) {
      setError('Failed to delete booking');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-[#F4A900] text-3xl font-bold mb-8">Manage All Bookings</h1>
      {error && <p className="text-red-500">{error}</p>}
      {bookings.map((booking, index) => (
        <div
          key={index}
          className="bg-gray-900 w-3/4 md:w-2/3 lg:w-3/5 p-6 rounded-lg shadow-lg mb-6"
        >
          <div className="grid grid-cols-6 text-lg font-semibold text-[#F4A900] border-b border-gray-700 pb-3">
            <span>User ID</span>
            <span>Bus Booked</span>
            <span>Seat No.</span>
            <span>Class</span>
            <span>From-To</span>
            <span>Date/Time</span>
            <span>Price</span>
          </div>
          <div className="grid grid-cols-6 text-lg text-white py-3">
            <span>{booking.user_id}</span>
            <span className="text-[#F4A900]">{booking.bus_id}</span>
            <span>{booking.seat_numbers}</span>
            <span>{booking.is_vip ? 'VIP' : 'Standard'}</span>
            <span className="text-[#F4A900]">{booking.origin} =={'>'} {booking.destination}</span>
            <span>{new Date(booking.departure_time).toLocaleString()}</span>
            <span>kshs {booking.amount_paid}</span>
          </div>
          <div className="flex justify-end mt-3 space-x-3">
            <button className="bg-green-600 text-black font-semibold px-4 py-2 rounded-md">
              Edit
            </button>
            <button
              onClick={() => handleDelete(booking.id)}
              className="bg-red-600 text-white font-semibold px-4 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}