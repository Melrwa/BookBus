"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection

export default function CreateCompany() {
  const [name, setName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter(); // Initialize useRouter

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !licenseNumber || !location) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Retrieve the JWT token from localStorage or cookies
      const token = localStorage.getItem("token"); // Replace with your token storage method

      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({ name, license_number: licenseNumber, location }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create company.");
      }

      // Store the role and company name in localStorage
      localStorage.setItem("role", "admin"); // Assuming the role is "admin" after creating a company
      localStorage.setItem("companyName", data.name); // Store the company name
      localStorage.setItem("company_id", data.id); // Store the company ID

      // Display success message with company name
      setSuccessMessage(`Company "${data.name}" created successfully!`);

      // Clear form fields
      setName("");
      setLicenseNumber("");
      setLocation("");

      // Redirect to /adminhomepage after 2 seconds
      setTimeout(() => {
        router.push("/adminhomepage");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">Create A Company</h1>
      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded-md mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg">
        <div className="mb-4">
          <label className="block text-[#F4A900] mb-2">Company Name</label>
          <input
            type="text"
            placeholder="Enter company name"
            className="w-full p-3 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-[#F4A900] mb-2">License Number</label>
          <input
            type="text"
            placeholder="Enter license number"
            className="w-full p-3 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-[#F4A900] mb-2">Location</label>
          <input
            type="text"
            placeholder="Enter location"
            className="w-full p-3 bg-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#F4A900] px-4 py-2 rounded text-black font-semibold"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Company"}
        </button>
      </form>
    </div>
  );
}