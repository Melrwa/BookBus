"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Define the SignupLoginPrompt component
const SignupLoginPrompt = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold text-yellow-500 mb-4">Signup or Login Required</h2>
        <p className="text-white mb-4">You need to sign up or log in to book a bus.</p>
        <div className="flex justify-end gap-2">
          <Link
            href="/signup"
            className="bg-green-500 px-4 py-2 rounded"
          >
            Signup
          </Link>
          <Link
            href="/login"
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Login
          </Link>
          <button
            onClick={onClose}
            className="bg-gray-500 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSignupLoginPrompt, setShowSignupLoginPrompt] = useState(false); // Track whether to show the signup/login prompt

  // Fetch available buses when the component mounts
  useEffect(() => {
    const fetchAvailableBuses = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/user/buses");

        // Check if the response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Invalid response: ${text}`);
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch buses.");
        }

        console.log("Fetched Buses:", data); // Log the response
        setSearchResults(data); // Set the fetched buses to state
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableBuses();
  }, []);

  // Handle manual search
  const handleSearch = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const fromLocation = formData.get("from");
    const toLocation = formData.get("to");
    const departureDate = formData.get("departure_date");

    if (!fromLocation || !toLocation || !departureDate) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/buses/search?from=${fromLocation}&to=${toLocation}&departure_date=${departureDate}`
      );

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Invalid response: ${text}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch buses.");
      }

      console.log("Backend response:", data); // Log the response
      setSearchResults(data); // Update search results with filtered buses
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle bus selection
  const handleSelectBus = () => {
    // Show the signup/login prompt
    setShowSignupLoginPrompt(true);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/dbujmywdy/image/upload/v1740398298/360_F_780280283_px55r99HxNSvCdLgm8dtw3otS8L5KMZw_augjb2.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold text-yellow-500">Bus Booking Services</h1>
          <p className="text-lg">Home - Bookings</p>
          <form onSubmit={handleSearch} className="mt-6 bg-gray-900 p-4 rounded-lg flex flex-wrap gap-4">
            <input
              type="text"
              name="from"
              placeholder="Traveling From"
              className="p-2 rounded w-40 text-black"
              required
            />
            <input
              type="text"
              name="to"
              placeholder="Traveling To"
              className="p-2 rounded w-40 text-black"
              required
            />
            <input
              type="date"
              name="departure_date"
              className="p-2 rounded w-40 text-black"
              required
            />
            <button
              type="submit"
              className="bg-[#F4A900] px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      {/* Bus Search Results */}
      <div className="container mx-auto p-4 mt-6">
        <h2 className="text-2xl font-bold text-yellow-500">Available Buses</h2>
        {loading ? (
          <p className="text-gray-400 mt-4">Loading buses...</p>
        ) : searchResults.length > 0 ? (
          searchResults.map((bus) => (
            <div
              key={bus.id}
              className="bg-gray-900 p-6 rounded-lg mt-4 flex flex-col gap-2 border border-black"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">
                    {bus.route}
                  </h3>
                  <p>
                    Departure:{" "}
                    <span className="font-semibold">
                      {new Date(bus.departure_time).toLocaleTimeString()}
                    </span>{" "}
                    | Arrival:{" "}
                    <span className="font-semibold">
                      {new Date(bus.arrival_time).toLocaleTimeString()}
                    </span>
                  </p>
                </div>
                <span className="text-yellow-400 font-bold">
                  {bus.travel_time}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="text-green-400 font-semibold">
                    Cost per Seat: Ksh {bus.cost_per_seat?.toFixed(2) || "0.00"}
                  </p>
                </div>
                <button
                  onClick={handleSelectBus}
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  Select
                </button>
              </div>
              <p className="text-white text-sm mt-2">
                Available Seats:{" "}
                <span className="bg-red-600 px-2 py-1 rounded text-white">
                  {bus.available_seats ?? "N/A"}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 mt-4">No buses found.</p>
        )}
      </div>

      {/* Signup/Login Prompt */}
      {showSignupLoginPrompt && (
        <SignupLoginPrompt
          onClose={() => setShowSignupLoginPrompt(false)}
        />
      )}

      {/* About Us Section */}
      <div className="bg-black p-8 mt-10 text-center">
        <h3 className="text-2xl font-bold text-yellow-500">Contact Us</h3>
        <p>Email: support@busbooking.com</p>
        <p>Phone: +254 700 000 000</p>
      </div>
    </div>
  );
}