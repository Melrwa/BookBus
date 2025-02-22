"use client";
import React from "react";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-500 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600">
          Log Out
        </button>
      </div>
      
      <div className="bg-black text-center text-lg font-semibold py-3 rounded-lg mb-6">
        Mash Poa Admin Panel
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <Card title="Manage Bookings" color="bg-blue-900" icon="📅" onClick={() => navigateTo('/manage-bookings')} />
        <Card title="Manage Buses" color="bg-green-800" icon="🚌" onClick={() => navigateTo('/adminhomepage/adminmanagebuses')} />
        <Card title="Manage Drivers" color="bg-blue-900" icon="🧑‍✈️" onClick={() => navigateTo('/adminhomepage/adminmanagedriver')} />
        <Card title="View Transactions" color="bg-red-800" icon="💵" onClick={() => navigateTo('/transactions')} />
        <Card title="User Alert/Reviews" color="bg-purple-800" icon="🔔" onClick={() => navigateTo('/user-alerts')} />
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
