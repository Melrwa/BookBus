'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'user', // Default role
    picture: null, // Holds the selected file
    driverDetails: {
      dob: '',
      gender: '',
      licenseNumber: '',
      accidentRecord: '',
      experience: '',
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.driverDetails) {
      setFormData({
        ...formData,
        driverDetails: { ...formData.driverDetails, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, picture: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImageToCloudinary = async () => {
    if (!formData.picture) return null;

    const data = new FormData();
    data.append('file', formData.picture);
    data.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary preset

    try {
      setUploading(true);
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Replace with your Cloudinary cloud name
        data
      );
      setUploading(false);
      return response.data.secure_url;
    } catch (error) {
      setUploading(false);
      console.error('Image upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = await uploadImageToCloudinary();
    const finalData = { ...formData, picture: imageUrl || null };

    console.log('Submitting:', finalData);
    // Here you would send `finalData` to your backend
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="bg-gray-900 p-10 rounded-xl shadow-lg w-3/4 md:w-2/3 lg:w-1/2">
        <h2 className="text-3xl font-bold text-center text-yellow-500 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {['fullname', 'username', 'email', 'phone_number', 'password'].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-[#F4A900] mb-1 capitalize">{field.replace(/_/g, ' ')}</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                placeholder={`Enter ${field}`}
                className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}
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
              className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="user">User</option>
              <option value="driver">Driver</option>
            </select>
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

          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black font-semibold p-4 rounded-md hover:bg-green-700 transition"
            disabled={uploading}
          >
            {uploading ? 'Uploading Image...' : 'Sign Up'}
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

