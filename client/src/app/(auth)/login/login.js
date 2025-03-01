'use client';

import { useState } from 'react';
import { FaUnlockAlt } from 'react-icons/fa'; // Unlocking keypad icon
import { useRouter } from 'next/navigation'; // For redirection

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Login request
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies for session-based auth
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Clear form and show success message
      setEmail('');
      setPassword('');
      setSuccessMessage('Login successful! Redirecting...');
      setErrorMessage('');

      // Check session to determine role and redirect
      const sessionData = await checkSession();
      if (sessionData) {
        switch (sessionData.role) {
          case 'admin':
            router.push('/adminhomepage');
            break;
          case 'driver':
            router.push('/driverhomepage');
            break;
          case 'user':
            router.push('/userhomepage');
            break;
          default:
            router.push('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setErrorMessage('Login failed. Please check your credentials.');
      setSuccessMessage('');
    }
  };

  const checkSession = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/check-session`, {
        method: 'GET',
        credentials: 'include', // Include cookies for session-based auth
      });

      if (!response.ok) {
        throw new Error('Session check failed');
      }

      const data = await response.json();
      return data; // { role: "admin" | "driver" | "user", user: { ... } }
    } catch (error) {
      console.error('Error checking session:', error);
      return null;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="bg-gray-900 p-10 rounded-xl shadow-lg w-full max-w-lg"> {/* Medium size */}
        <h2 className="text-3xl font-bold text-center text-[#F4A900] mb-6 flex items-center justify-center">
          <FaUnlockAlt className="mr-2" /> Log In
        </h2>
        {successMessage && (
          <div className="bg-green-500 text-white p-3 rounded-md mb-4">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {errorMessage}
          </div>
        )}
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