'use client';

import { useState } from 'react';
import axios from 'axios';
import { FaCamera } from 'react-icons/fa'; // Correct import for the Camera icon
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Signup() {
  const router = useRouter(); // Initialize useRouter

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '', // New field
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
  const [isDriver, setIsDriver] = useState(false);
  const [passwordError, setPasswordError] = useState(''); // For password validation

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('driverDetails.')) {
      const driverField = name.split('.')[1];
      setFormData({
        ...formData,
        driverDetails: { ...formData.driverDetails, [driverField]: value },
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

    // Validate password and confirm password
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordError('');

    let imageUrl = await uploadImageToCloudinary();
    const finalData = {
      ...formData,
      picture: imageUrl || null,
    };

    console.log('Submitting:', finalData);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, // Replace with your Flask backend endpoint
        finalData
      );
      console.log('Signup successful:', response.data);

      // Redirect based on role
      if (formData.role === 'driver') {
        router.push('/driverhomepage'); // Redirect to driver homepage
      } else {
        router.push('/'); // Redirect to user homepage
      }
    } catch (error) {
      console.error('Signup failed:', error.response.data);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="bg-gray-900 p-10 rounded-xl shadow-lg w-3/4 md:w-2/3 lg:w-1/2">
        <h2 className="text-3xl font-bold text-center text-yellow-500 mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {['fullname', 'username', 'email', 'phone_number', 'password', 'confirmPassword'].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-[#F4A900] mb-1 capitalize">{field.replace(/_/g, ' ')}</label>
              <input
                type={field.includes('password') ? 'password' : 'text'} // Ensure both password fields are hidden
                name={field}
                placeholder={`Enter ${field}`}
                className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={formData[field]}
                onChange={handleChange}
              />
              {field === 'confirmPassword' && passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
          ))}

          <div className="mb-4">
            <label className="block text-[#F4A900] mb-1">Role</label>
            <select
              name="role"
              className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={formData.role}
              onChange={(e) => {
                setFormData({ ...formData, role: e.target.value });
                setIsDriver(e.target.value === 'driver');
              }}
            >
              <option value="user">User</option>
              <option value="driver">Driver</option>
            </select>
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-4 flex items-center">
            <label className="block text-[#F4A900] mb-1 mr-4">Profile Picture</label>
            <div className="relative">
              <input
                type="file"
                name="picture"
                className="hidden"
                id="picture-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="picture-upload" className="cursor-pointer">
                <FaCamera className="w-8 h-8 text-[#F4A900]" />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-12 h-12 rounded-full ml-4"
                />
              )}
            </div>
          </div>

          {isDriver && (
            <>
              <div className="mb-4">
                <label className="block text-[#F4A900] mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="driverDetails.dob"
                  className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.driverDetails.dob}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#F4A900] mb-1">Gender</label>
                <select
                  name="driverDetails.gender"
                  className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.driverDetails.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-[#F4A900] mb-1">License Number</label>
                <input
                  type="text"
                  name="driverDetails.licenseNumber"
                  className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.driverDetails.licenseNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#F4A900] mb-1">Accident Record</label>
                <input
                  type="text"
                  name="driverDetails.accidentRecord"
                  className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.driverDetails.accidentRecord}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#F4A900] mb-1">Years of Experience</label>
                <input
                  type="number"
                  name="driverDetails.experience"
                  className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.driverDetails.experience}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black font-semibold p-4 rounded-md hover:bg-green-700 transition"
            disabled={uploading}
          >
            {uploading ? 'Uploading Image...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-[#F4A900] mt-6">
          Already have an account? <a href="/login" className="font-bold">Login</a>
        </p>
      </div>
    </div>
  );
}