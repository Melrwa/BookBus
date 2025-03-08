"use client";

import React, { useEffect, useState } from "react";

const DriverHomePage = () => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const response = await fetch("/api/driver-details", {
          method: "GET",
          credentials: "include", // Include cookies for authentication
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDriver(data); // Set the fetched driver data
      } catch (error) {
        console.error("Error fetching driver data:", error);
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchDriverDetails();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-white text-center">Error: {error}</div>;
  }

  if (!driver) {
    return <div className="text-white text-center">No driver data found.</div>;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Bus Details */}
      <div className="max-w-4xl mx-auto mt-8 bg-gray-900 rounded-lg p-4">
        <img
          src={driver.bus?.image || "/bus-image.jpg"} // Use fetched bus image or a fallback
          alt="Bus"
          className="w-full h-80 object-cover rounded"
        />
        <div className="text-center my-4 bg-black text-yellow-500 text-lg font-bold py-2">
          {driver.bus?.name || "N/A"} {/* Display bus name or fallback */}
        </div>
        <div className="grid grid-cols-3 gap-4 text-center bg-gray-800 p-4 rounded">
          <div>
            <p className="text-white">Capacity</p>
            <p className="text-yellow-400 text-xl font-bold">
              {driver.bus?.capacity || "N/A"} {/* Display bus capacity or fallback */}
            </p>
          </div>
          <div>
            <p className="text-white">Booked</p>
            <p className="text-yellow-400 text-xl font-bold">
              {driver.bus?.booked || "N/A"} {/* Display booked seats or fallback */}
            </p>
          </div>
          <div>
            <p className="text-white">Available</p>
            <p className="text-yellow-400 text-xl font-bold">
              {driver.bus?.available || "N/A"} {/* Display available seats or fallback */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverHomePage;