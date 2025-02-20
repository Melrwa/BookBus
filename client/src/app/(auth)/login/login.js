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
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-yellow-500 mb-4">Log In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#F4A900] mb-1">Enter Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#F4A900] mb-1">Enter Your Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black font-semibold p-3 rounded-md hover:bg-yellow-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}