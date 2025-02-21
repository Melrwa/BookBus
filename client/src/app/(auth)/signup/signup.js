'use client';

import { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-[#F4A900] mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-[#F4A900] mb-1">Enter Your Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          {/* Email Address */}
          <div className="mb-4">
            <label className="block text-[#F4A900] mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-[#F4A900] mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-[#F4A900] mb-1">Set Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-[#F4A900] mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black font-semibold p-3 rounded-md hover:bg-yellow-600 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-[#F4A900] mt-4">
          Already have an account? <a href="/login" className="font-bold">Login</a>
        </p>
      </div>
    </div>
  );
}