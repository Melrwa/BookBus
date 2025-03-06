"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

const AddBusForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bus_number: "",
    capacity: "",
    route: "",
    image_url: "", // Changed from image file to URL
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(""); // For image preview

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear validation errors when the user types

    // Update image preview when the image URL changes
    if (name === "image_url") {
      setImagePreview(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bus_number) newErrors.bus_number = "Bus number is required.";
    if (!formData.capacity) newErrors.capacity = "Capacity is required.";
    if (!formData.route) newErrors.route = "Route is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/buses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(formData), // Send only the required fields
      });

      if (response.ok) {
        const newBus = await response.json();
        console.log("Bus added successfully:", newBus);
        setSuccessMessage("Bus added successfully! Redirecting...");

        // Reset form fields
        setFormData({
          bus_number: "",
          capacity: "",
          route: "",
          image_url: "",
        });
        setImagePreview(""); // Clear image preview

        // Redirect to the manage buses page after 2 seconds
        setTimeout(() => {
          router.push("/admin/manage-buses");
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to add bus. Please try again.");
      }
    } catch (error) {
      console.error("Error adding bus:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-[#F4A900] text-xl font-semibold text-center mb-6">Add a New Bus</h2>
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
            <label className="text-[#F4A900] block mb-1">Bus Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter image URL"
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Bus Preview"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-[#F4A900] text-black p-2 rounded font-semibold flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              "Add Bus"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBusForm;