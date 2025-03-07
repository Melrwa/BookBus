"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [adminUsername, setAdminUsername] = useState("");

  // Fetch the company name and admin username on component mount
  useEffect(() => {
    // Retrieve the company name from localStorage
    const storedCompanyName = localStorage.getItem("companyName");
    if (storedCompanyName) {
      setCompanyName(storedCompanyName);
    }

    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setAdminUsername(storedUsername);
    }
  }, []);

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-500 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {companyName && (
            <p className="text-sm text-gray-400">Company: {companyName}</p>
          )}
        </div>
        {adminUsername && (
          <div className="text-sm text-gray-400">
            Welcome,{" "}
            <span className="font-semibold text-yellow-500">{adminUsername}</span>
          </div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <Card
          title="Manage Bookings"
          color="bg-blue-900"
          icon="📅"
          onClick={() => navigateTo("/adminhomepage/adminmanagebookings")}
        />
        <Card
          title="Manage Buses"
          color="bg-green-800"
          icon="🚌"
          onClick={() => navigateTo("/adminhomepage/adminmanagebuses")}
        />
        <Card
          title="Manage Drivers"
          color="bg-blue-900"
          icon="🧑‍✈️"
          onClick={() => navigateTo("/adminhomepage/adminmanagedriver")}
        />
        <Card
          title="View Transactions"
          color="bg-red-800"
          icon="💵"
          onClick={() => navigateTo("adminhomepage/adminmanagetransactions")}
        />
        <Card
          title="User Alert/Reviews"
          color="bg-purple-800"
          icon="🔔"
          onClick={() => navigateTo("adminhomepage/adminmanagereviews")}
        />
      </div>
    </div>
  );
};

const Card = ({ title, color, icon, onClick }) => {
  return (
    <button
      className={`${color} text-center text-yellow-500 p-6 rounded-lg shadow-lg w-full hover:opacity-80 transition`}
      onClick={onClick}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </button>
  );
};



export default AdminDashboard;