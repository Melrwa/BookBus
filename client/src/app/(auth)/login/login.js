'use client';

import { useState } from 'react';
import { FaUnlockAlt, FaSpinner, FaKey } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      localStorage.setItem('role', data.role);
      setUsername('');
      setPassword('');
      setSuccessMessage('Login successful! Redirecting...');

      switch (data.role) {
        case 'admin': router.push('/adminhomepage'); break;
        case 'driver': router.push('/driverhomepage'); break;
        case 'user': router.push('/userhomepage'); break;
        default: router.push('/');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setErrorMessage('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await fetch('api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'Password reset failed. Try again.');
      } else {
        setSuccessMessage('Password reset link sent to your email!');
        setEmail('');
      }
    } catch (error) {
      setErrorMessage('Error sending reset link. Try again later.');
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
        {successMessage && <div className="bg-green-500 text-white p-3 rounded-md mb-4">{successMessage}</div>}
        {errorMessage && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{errorMessage}</div>}
        {!showResetForm ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-[#F4A900] mb-2">Enter Username</label>
              <input type="text" placeholder="Enter your username" className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-6">
              <label className="block text-[#F4A900] mb-2">Enter Your Password</label>
              <input type="password" placeholder="Enter your password" className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-[#F4A900] text-black font-semibold p-4 rounded-md hover:bg-yellow-600 transition flex items-center justify-center" disabled={loading}>
              {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Login'}
            </button>
            <p className="text-center text-[#F4A900] mt-4 cursor-pointer hover:underline" onClick={() => setShowResetForm(true)}>Forgot Password?</p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div className="mb-6">
              <label className="block text-[#F4A900] mb-2">Enter Your Email</label>
              <input type="email" placeholder="Enter your email" className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="w-full bg-[#F4A900] text-black font-semibold p-4 rounded-md hover:bg-yellow-600 transition flex items-center justify-center" disabled={loading}>
              {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Reset Password'}
            </button>
            <p className="text-center text-[#F4A900] mt-4 cursor-pointer hover:underline" onClick={() => setShowResetForm(false)}>Back to Login</p>
          </form>
        )}
      </div>
    </div>
  );
}
