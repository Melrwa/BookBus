'use client';

import { useState } from 'react';
import { FaCamera, FaUserPlus, FaSpinner } from 'react-icons/fa'; // Added FaSpinner for loading state
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    picture: null,
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
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    data.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: data,
        }
      );
      const result = await response.json();
      setUploading(false);
      return result.secure_url;
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

    // Upload image to Cloudinary
    let imageUrl = await uploadImageToCloudinary();

    // Prepare final data for submission
    const finalData = {
        ...formData,
        picture: imageUrl || null,
    };

    // If the user is a driver, ensure the 'name' field is included
    if (finalData.role === 'driver') {
        finalData.driverDetails = {
            ...finalData.driverDetails,
            name: finalData.fullname,  // Use the user's fullname as the driver's name
        };
    }

    console.log('Submitting:', finalData);

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalData),
        });
        const result = await response.json();

        if (!response.ok) {
            // Handle backend validation errors
            setErrorMessage(result.error || 'Signup failed. Please try again.');
            setSuccessMessage('');
            return;
        }

        console.log('Signup successful:', result);

        // Clear form and show success message
        setSuccessMessage('Signup successful! Redirecting...');
        setErrorMessage('');
        setFormData({
            fullname: '',
            username: '',
            email: '',
            phone_number: '',
            password: '',
            confirmPassword: '',
            role: 'user',
            picture: null,
            driverDetails: {
                dob: '',
                gender: '',
                licenseNumber: '',
                accidentRecord: '',
                experience: '',
            },
        });
        setImagePreview(null);

        // Redirect based on role
        setTimeout(() => {
            if (formData.role === 'driver') {
                router.push('/driverhomepage');
            } else {
                router.push('/');
            }
        }, 2000);
    } catch (error) {
        console.error('Signup failed:', error.message);
        setErrorMessage('Signup failed. Please try again.');
        setSuccessMessage('');
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
          {['fullname', 'username', 'email', 'phone_number', 'password', 'confirmPassword'].map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block text-[#F4A900] mb-1 capitalize">{field.replace(/_/g, ' ')}</label>
              <input
                type={field.includes('password') ? 'password' : 'text'}
                name={field}
                placeholder={`Enter ${field}`}
                className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                value={formData[field]}
                onChange={handleChange}
                required
              />
              {field === 'confirmPassword' && passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
          ))}

          {/* Role Selection */}
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
              required
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

          {/* Driver Details (Conditional Rendering) */}
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
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#F4A900] mb-1">Gender</label>
                <select
                  name="driverDetails.gender"
                  className="w-full p-3 bg-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  value={formData.driverDetails.gender}
                  onChange={handleChange}
                  required
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
                  required
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
                  required
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
                  min="0"
                  required
                />
              </div>
            </>
          )}

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