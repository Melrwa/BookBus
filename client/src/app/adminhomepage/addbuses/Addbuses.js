"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterBus() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bus_number: "",
    capacity: "",
    route: "",
    company_id: "", // Will be dynamically set
    price: "",
    time: "",
    image: null, // For image upload
  });
  const [errors, setErrors] = useState({}); // For validation errors

  // Fetch the logged-in admin's company ID on component mount
  useEffect(() => {
    const fetchAdminCompanyId = async () => {
      try {
        const response = await fetch("/api/auth/me"); // Endpoint to fetch admin details
        const data = await response.json();
        if (data.company_id) {
          setFormData((prev) => ({ ...prev, company_id: data.company_id }));
        }
      } catch (error) {
        console.error("Failed to fetch admin company ID:", error);
      }
    };

    fetchAdminCompanyId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation errors when the user types
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bus_number) newErrors.bus_number = "Bus number is required.";
    if (!formData.capacity) newErrors.capacity = "Number of seats is required.";
    if (!formData.route) newErrors.route = "Route is required.";
    if (!formData.price) newErrors.price = "Cost per seat is required.";
    if (!formData.time) newErrors.time = "Time of travel is required.";
    if (!formData.company_id) newErrors.company_id = "Company ID is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("bus_number", formData.bus_number);
      formDataToSend.append("capacity", formData.capacity);
      formDataToSend.append("route", formData.route);
      formDataToSend.append("company_id", formData.company_id);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("time", formData.time);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch("/api/buses", {
        method: "POST",
        body: formDataToSend, // Use FormData for file uploads
      });

      if (response.ok) {
        const newBus = await response.json();
        console.log("Bus added successfully:", newBus);
        router.push("/admin/manage-buses"); // Redirect to the manage buses page
      } else {
        const errorData = await response.json();
        console.error("Failed to add bus:", errorData.error);
      }
    } catch (error) {
      console.error("Error adding bus:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-[#F4A900] text-xl font-semibold text-center mb-6">
          Register a New Bus
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Bus Number */}
          <div>
            <label className="text-[#F4A900] block mb-1">Bus Number</label>
            <input
              type="text"
              name="bus_number"
              value={formData.bus_number}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            {errors.bus_number && (
              <p className="text-red-500 text-sm mt-1">{errors.bus_number}</p>
            )}
          </div>

          {/* Number of Seats */}
          <div>
            <label className="text-[#F4A900] block mb-1">Number of Seats</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
            )}
          </div>

          {/* Cost Per Seat */}
          <div>
            <label className="text-[#F4A900] block mb-1">Cost Per Seat</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Route */}
          <div>
            <label className="text-[#F4A900] block mb-1">Route</label>
            <input
              type="text"
              name="route"
              value={formData.route}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            {errors.route && (
              <p className="text-red-500 text-sm mt-1">{errors.route}</p>
            )}
          </div>

          {/* Time of Travel */}
          <div>
            <label className="text-[#F4A900] block mb-1">Time Of Travel</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </div>

          {/* Company ID (Hidden, Dynamically Set) */}
          <input
            type="hidden"
            name="company_id"
            value={formData.company_id}
          />

          {/* Image Upload */}
          <div>
            <label className="text-[#F4A900] block mb-1">Bus Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageUpload}
              className="w-full p-2 rounded bg-gray-700 text-white"
              accept="image/*"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black p-2 rounded font-semibold"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}