// import React from 'react'

// export default function Bookbus() {
//   return (
//     <div>
//         Bookbus
//     </div>
//   )
// }


'use client';

import { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idPassport: '',
    residence: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="border border-gray-500 p-8 bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-center text-[#F4A900] text-2xl font-bold mb-6">
          Booking Submission
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[#F4A900] font-semibold mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-300 text-black focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-[#F4A900] font-semibold mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-300 text-black focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-[#F4A900] font-semibold mb-1">
              ID/Passport
            </label>
            <input
              type="text"
              name="idPassport"
              value={formData.idPassport}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-300 text-black focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-[#F4A900] font-semibold mb-1">
              Residence
            </label>
            <input
              type="text"
              name="residence"
              value={formData.residence}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-300 text-black focus:outline-none"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-[#F4A900] font-semibold mb-1">
              Passenger Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-300 text-black focus:outline-none"
              required
            />
          </div>
          <div className="col-span-2 flex justify-center">
            <a href='/selectseat' className="bg-[#F4A900] text-black p-2 rounded font-semibold hover:bg-yellow-600">

              Proceed to select Seat...
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
