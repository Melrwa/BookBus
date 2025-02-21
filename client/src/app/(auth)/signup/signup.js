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
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-yellow-500 mb-4">Sign Up</h2>
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

          {/* Profile Picture Upload */}
          <div className="mb-4">
            <label className="block text-[#F4A900] mb-1">Profile Picture (Optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 bg-gray-300 rounded-md" />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-24 h-24 rounded-md" />}
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-[#F4A900] mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="user">User</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          {/* Driver Details (Shown only if Driver is selected) */}
          {formData.role === 'driver' && (
            <div className="border p-4 rounded-md border-yellow-500">
              <h3 className="text-yellow-500 font-semibold mb-2">Driver Details</h3>
              {['dob', 'gender', 'licenseNumber', 'accidentRecord', 'experience'].map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-[#F4A900] mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    type={field === 'dob' ? 'date' : 'text'}
                    name={field}
                    placeholder={`Enter ${field}`}
                    className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={formData.driverDetails[field]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black font-semibold p-3 rounded-md hover:bg-green-700 transition"
            disabled={uploading}
          >
            {uploading ? 'Uploading Image...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
