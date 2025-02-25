'use client';

import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="bg-gray-900 p-10 rounded-xl shadow-lg w-3/4 md:w-2/3 lg:w-1/2">
        <h2 className="text-3xl font-bold text-center text-[#F4A900] mb-6">Log In</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-6">
            <label className="block text-[#F4A900] mb-2">Enter Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-[#F4A900] mb-2">Enter Your Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black font-semibold p-4 rounded-md hover:bg-yellow-600 transition"
          >
            Login
          </button>
        </form>

        {/* Signup Redirect */}
        <p className="text-center text-[#F4A900] mt-6">
          Don't have an account? <a href="/signup" className="font-bold">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
