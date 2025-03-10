'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaLock, FaSpinner } from 'react-icons/fa';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // Extract token from URL

  useEffect(() => {
    if (!token) {
      setErrorMessage('Invalid or expired password reset link.');
    }
  }, [token]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setErrorMessage('Please fill in both fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/reset-password-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to reset password. Try again.');
      } else {
        setSuccessMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => router.push('/login'), 3000);
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="bg-gray-900 p-10 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-[#F4A900] mb-6 flex items-center justify-center">
          <FaLock className="mr-2" /> Reset Password
        </h2>
        {successMessage && <div className="bg-green-500 text-white p-3 rounded-md mb-4">{successMessage}</div>}
        {errorMessage && <div className="bg-red-500 text-white p-3 rounded-md mb-4">{errorMessage}</div>}
        <form onSubmit={handleResetPassword}>
          <div className="mb-6">
            <label className="block text-[#F4A900] mb-2">New Password</label>
            <input type="password" placeholder="Enter new password" className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="mb-6">
            <label className="block text-[#F4A900] mb-2">Confirm Password</label>
            <input type="password" placeholder="Confirm new password" className="w-full p-4 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#F4A900]" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="w-full bg-[#F4A900] text-black font-semibold p-4 rounded-md hover:bg-yellow-600 transition flex items-center justify-center" disabled={loading}>
            {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
