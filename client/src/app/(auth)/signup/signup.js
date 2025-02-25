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
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="bg-gray-900 p-10 rounded-xl shadow-lg w-3/4 md:w-2/3 lg:w-1/2">
        <h2 className="text-3xl font-bold text-center text-[#F4A900] mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-[#F4A900] mb-2">Enter Your Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          {/* Email Address */}
          <div className="mb-6">
            <label className="block text-[#F4A900] mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Phone Number */}
          <div className="mb-6">
            <label className="block text-[#F4A900] mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-[#F4A900] mb-2">Set Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-[#F4A900] mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black font-semibold p-4 rounded-md hover:bg-yellow-600 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-[#F4A900] mt-6">
          Already have an account? <a href="/login" className="font-bold">Login</a>
        </p>
      </div>
    </div>
  );
}
