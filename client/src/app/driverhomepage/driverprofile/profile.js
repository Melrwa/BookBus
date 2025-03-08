"use client"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DriverProfile = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    fetch(`/api/drivers/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => setDriver(data))
      .catch(error => console.error("Error fetching driver data:", error));
  }, [id]);

  if (!driver) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-yellow-400 flex justify-center items-center p-6">
      <div className="bg-yellow-500 text-black p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Driver Profile</h2>
        <div className="space-y-3">
          <p><span className="font-semibold">Name:</span> {driver.name}</p>
          <p><span className="font-semibold">Date of Birth:</span> {driver.dob}</p>
          <p><span className="font-semibold">Gender:</span> {driver.gender}</p>
          <p><span className="font-semibold">License Number:</span> {driver.license_number}</p>
          <p><span className="font-semibold">Years of Experience:</span> {driver.years_of_experience}</p>
          <p><span className="font-semibold">Bus Name:</span> {driver.bus?.name || "N/A"}</p>
          <p><span className="font-semibold">Bus Number:</span> {driver.bus?.number || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;