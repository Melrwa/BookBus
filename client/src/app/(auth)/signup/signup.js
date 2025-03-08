'use client';

import { useState } from 'react';
import { FaUserPlus, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer', // Hardcoded role as 'customer'
  });

  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        throw new Error(errorText || 'Signup failed. Please try again.');
      }

      const result = await response.json(); // Parse the response as JSON
      setSuccessMessage('Signup successful! Redirecting...');
      setErrorMessage('');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'customer',
      });

      router.push('/userhomepage');
    } catch (error) {
      console.error('Signup failed:', error.message);
      setErrorMessage(error.message || 'Signup failed. Please try again.');
      setSuccessMessage('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-yellow-500 mb-6 flex items-center justify-center">
          <FaUserPlus className="mr-2" /> Sign Up
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
          {['name', 'email', 'password'].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-[#F4A900] mb-1 capitalize">{field}</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                placeholder={`Enter ${field}`}
                className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black font-semibold p-4 rounded-md hover:bg-green-700 transition flex items-center justify-center"
            disabled={uploading}
          >
            {uploading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-[#F4A900] mt-6">
          Already have an account? <a href="/login" className="font-bold">Login</a>
        </p>
      </div>
    </div>
  );
}