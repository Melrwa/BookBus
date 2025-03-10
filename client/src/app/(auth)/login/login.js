'use client';

import { useState } from 'react';
import { FaUnlockAlt, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Login request
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        throw new Error(errorText || 'Login failed. Please check your credentials.');
      }

      const data = await response.json(); // Parse the response as JSON

      console.log('Login successful:', data);

      // Store user details in localStorage
      localStorage.setItem('token', data.token); // Store the token
      localStorage.setItem('role', data.user.role); // Store the user's role
      localStorage.setItem('email', data.user.email); // Store the user's email

      // Clear form and show success message
      setEmail('');
      setPassword('');
      setSuccessMessage('Login successful! Redirecting...');

      // Redirect to the user homepage
      router.push('/userhomepage');
    } catch (error) {
      console.error('Login error:', error.message);
      setErrorMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="bg-gray-900 p-10 rounded-xl shadow-lg w-full max-w-lg">
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
              required
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
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black font-semibold p-4 rounded-md hover:bg-yellow-600 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              'Login'
            )}
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