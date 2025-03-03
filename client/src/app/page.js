"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch schedules for the current date when the component mounts
  useEffect(() => {
    const fetchSchedulesForCurrentDate = async () => {
      const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/schedules/search?origin=Mombasa&destination=Nairobi&date=${currentDate}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch schedules.");
        }

        const data = await response.json();
        console.log("Backend response:", data); // Log the response
        setSearchResults(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedulesForCurrentDate();
  }, []);

  // Handle manual search
  const handleSearch = async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const origin = formData.get("origin");
    const destination = formData.get("destination");
    const date = formData.get("date");
  
    if (!origin || !destination || !date) {
      setError("Please fill in all fields.");
      return;
    }
  
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch(
        `/api/schedules/search?origin=${origin}&destination=${destination}&date=${date}`
      );
  
      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Invalid response: ${text}`);
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch schedules.");
      }
  
      console.log("Backend response:", data); // Log the response
      setSearchResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
              name="origin"
              placeholder="Traveling From"
              className="p-2 rounded w-40 text-black"
              required
            />
            <input
              type="text"
              name="destination"
              placeholder="Traveling To"
              className="p-2 rounded w-40 text-black"
              required
            />
            <input
              type="date"
              name="date"
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
          <p className="text-gray-400 mt-4">Loading schedules...</p>
        ) : searchResults.length > 0 ? (
          searchResults.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-gray-800 p-6 rounded-lg mt-4 flex flex-col gap-2 border border-gray-700"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">
                    {schedule.origin} → {schedule.destination}
                  </h3>
                  <p>
                    Departure:{" "}
                    <span className="font-semibold">
                      {new Date(schedule.departure_time).toLocaleTimeString()}
                    </span>{" "}
                    | Arrival:{" "}
                    <span className="font-semibold">
                      {new Date(schedule.arrival_time).toLocaleTimeString()}
                    </span>
                  </p>
                </div>
                <span className="text-yellow-400 font-bold">
                  {Math.floor(
                    (new Date(schedule.arrival_time) - new Date(schedule.departure_time)) /
                      (1000 * 60 * 60)
                  )}{" "}
                  hrs
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div>
                  <p className="text-green-400 font-semibold">
                    VIP: kshs {schedule.vip_price}
                  </p>
                  <p className="text-red-400 font-semibold">
                    Normal: kshs {schedule.business_price}
                  </p>
                </div>
                <a
                  href={`/bookingbus?scheduleId=${schedule.id}`}
                  className="bg-red-500 px-4 py-2 rounded"
                >
                  Select
                </a>
              </div>
              <p className="text-white text-sm mt-2">
                Available Seats:{" "}
                <span className="bg-red-600 px-2 py-1 rounded text-white">
                  {schedule.bus.seats_available}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 mt-4">No schedules found.</p>
        )}
      </div>

      {/* About Us Section */}
      <div className="bg-gray-900 p-8 mt-10 text-center">
        <h3 className="text-2xl font-bold text-yellow-500">Contact Us</h3>
        <p>Email: support@busbooking.com</p>
        <p>Phone: +254 700 000 000</p>
      </div>
    </div>
  );
}