"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddBusForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bus_number: "",
    capacity: "",
    route: "",
    company_id: "", // Will be dynamically set
    image: null, // For image upload
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear validation errors when the user types
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
    if (!formData.capacity) newErrors.capacity = "Capacity is required.";
    if (!formData.route) newErrors.route = "Route is required.";
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
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await fetch("/api/buses", {
        method: "POST",
        body: formDataToSend, // Use FormData for file uploads
        // Do not set Content-Type header manually; the browser will handle it
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
        <h2 className="text-[#F4A900] text-xl font-semibold text-center mb-6">Add a New Bus</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            {errors.bus_number && <p className="text-red-500 text-sm mt-1">{errors.bus_number}</p>}
          </div>
          <div>
            <label className="text-[#F4A900] block mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
          </div>
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
            {errors.route && <p className="text-red-500 text-sm mt-1">{errors.route}</p>}
          </div>
          <div>
            <label className="text-[#F4A900] block mb-1">Company ID</label>
            <input
              type="text"
              name="company_id"
              value={formData.company_id}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              required
            />
            {errors.company_id && <p className="text-red-500 text-sm mt-1">{errors.company_id}</p>}
          </div>
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
          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black p-2 rounded font-semibold"
          >
            Add Bus
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBusForm;