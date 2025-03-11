'use client'
import React, { useState, useEffect } from 'react';

export default function DriverHomepage() {
  const [view, setView] = useState('allBuses'); // State to manage which card is active
  const [allBuses, setAllBuses] = useState([]); // State to store all buses
  const [assignedBuses, setAssignedBuses] = useState([]); // State to store assigned buses
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch all buses
  const fetchAllBuses = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/my_buses'); // Replace with your actual endpoint
      if (!response.ok) throw new Error('Failed to fetch all buses');
      const data = await response.json();
      setAllBuses(data);
    } catch (error) {
      console.error('Error fetching all buses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assigned buses
  const fetchAssignedBuses = async () => {
    setLoading(true);
    try {
      const driverId = 11; // Replace with the actual driver ID (e.g., from authentication)
      const response = await fetch(`/api/driver/my_assigned_bus?driver_id=${driverId}`);
      if (!response.ok) throw new Error('Failed to fetch assigned buses');
      const data = await response.json();
      setAssignedBuses(data);
    } catch (error) {
      console.error('Error fetching assigned buses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update bus details (price, route, schedule, etc.)
  const updateBus = async (busId, updatedData) => {
    try {
      const response = await fetch(`/api/driver/update_bus/${busId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error('Failed to update bus');
      fetchAllBuses(); // Refresh the list after updating
    } catch (error) {
      console.error('Error updating bus:', error);
    }
  };

  // Add a new bus
  const addBus = async (newBusData) => {
    try {
      const response = await fetch('/api/driver/add_bus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBusData),
      });
      if (!response.ok) throw new Error('Failed to add bus');
      fetchAllBuses(); // Refresh the list after adding
    } catch (error) {
      console.error('Error adding bus:', error);
    }
  };

  // Fetch data based on the active view
  useEffect(() => {
    if (view === 'allBuses') {
      fetchAllBuses();
    } else if (view === 'assignedBuses') {
      fetchAssignedBuses();
    }
  }, [view]);

  return (
    <div className="min-h-screen bg-black text-yellow-500 p-8">
      <h1 className="text-3xl font-bold mb-8">Driver Dashboard</h1>

      {/* Toggle Buttons */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setView('allBuses')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            view === 'allBuses' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-yellow-500 hover:bg-gray-700'
          }`}
        >
          Manage All Buses
        </button>
        <button
          onClick={() => setView('assignedBuses')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            view === 'assignedBuses' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-yellow-500 hover:bg-gray-700'
          }`}
        >
          My Assigned Buses
        </button>
        <button
          onClick={() => setView('addBus')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            view === 'addBus' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-yellow-500 hover:bg-gray-700'
          }`}
        >
          Add Bus
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : view === 'allBuses' ? (
          <AllBusesView buses={allBuses} onUpdateBus={updateBus} />
        ) : view === 'assignedBuses' ? (
          <AssignedBusesView buses={assignedBuses} />
        ) : (
          <AddBusForm onAddBus={addBus} />
        )}
      </div>
    </div>
  );
}

// Component to display all buses and allow updates
function AllBusesView({ buses, onUpdateBus }) {
  const [editingBus, setEditingBus] = useState(null); // State to track which bus is being edited

  const handleUpdate = (busId, updatedData) => {
    onUpdateBus(busId, updatedData);
    setEditingBus(null); // Exit editing mode
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Buses</h2>
      {buses.length > 0 ? (
        <div className="space-y-4">
          {buses.map((bus) => (
            <div key={bus.id} className="bg-gray-700 p-4 rounded-lg">
              {editingBus === bus.id ? (
                <EditBusForm bus={bus} onUpdate={handleUpdate} />
              ) : (
                <>
                  <p className="text-yellow-500">Bus ID: {bus.id}</p>
                  <p className="text-yellow-500">Route: {bus.route}</p>
                  <p className="text-yellow-500">Departure: {bus.departure_time}</p>
                  <p className="text-yellow-500">Arrival: {bus.arrival_time}</p>
                  <p className="text-yellow-500">Price per Seat: ${bus.cost_per_seat}</p>
                  <button
                    onClick={() => setEditingBus(bus.id)}
                    className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Edit Bus
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-yellow-500">No buses available.</p>
      )}
    </div>
  );
}

// Component to edit bus details
function EditBusForm({ bus, onUpdate }) {
  const [formData, setFormData] = useState({
    route: bus.route,
    departure_time: bus.departure_time,
    arrival_time: bus.arrival_time,
    cost_per_seat: bus.cost_per_seat,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(bus.id, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="text"
        value={formData.route}
        onChange={(e) => setFormData({ ...formData, route: e.target.value })}
        className="w-full p-2 bg-gray-600 text-yellow-500 rounded-lg"
        placeholder="Route"
      />
      <input
        type="datetime-local"
        value={formData.departure_time}
        onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
        className="w-full p-2 bg-gray-600 text-yellow-500 rounded-lg"
      />
      <input
        type="datetime-local"
        value={formData.arrival_time}
        onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
        className="w-full p-2 bg-gray-600 text-yellow-500 rounded-lg"
      />
      <input
        type="number"
        value={formData.cost_per_seat}
        onChange={(e) => setFormData({ ...formData, cost_per_seat: e.target.value })}
        className="w-full p-2 bg-gray-600 text-yellow-500 rounded-lg"
        placeholder="Price per Seat"
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Save Changes
      </button>
    </form>
  );
}

// Component to display assigned buses
function AssignedBusesView({ buses }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Assigned Buses</h2>
      {buses.length > 0 ? (
        <div className="space-y-4">
          {buses.map((bus) => (
            <div key={bus.id} className="bg-gray-700 p-4 rounded-lg">
              <p className="text-yellow-500">Bus ID: {bus.id}</p>
              <p className="text-yellow-500">Route: {bus.route}</p>
              <p className="text-yellow-500">Departure: {bus.departure_time}</p>
              <p className="text-yellow-500">Arrival: {bus.arrival_time}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-yellow-500">No buses assigned to you.</p>
      )}
    </div>
  );
}

// Component to add a new bus
function AddBusForm({ onAddBus }) {
  const [formData, setFormData] = useState({
    number_of_seats: '',
    cost_per_seat: '',
    route: '',
    departure_time: '',
    arrival_time: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddBus(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Add New Bus</h2>
      <input
        type="number"
        value={formData.number_of_seats}
        onChange={(e) => setFormData({ ...formData, number_of_seats: e.target.value })}
        className="w-full p-2 bg-gray-600 text-yellow-500 rounded-lg"
        placeholder="Number of Seats"
        required
      />
      <input
        type="number"
        value={formData.cost_per_seat}
        onChange={(e) => setFormData({ ...formData, cost_per_seat: e.target.value })}
        className="w-full p-2 bg-gray-600 text-yellow-500 rounded-lg"
        placeholder="Cost per Seat"
        required
      />
      <input
        type="text"
        value={formData.route}
        onChange={(e) => setFormData({ ...formData, route: e.target.value })}
        className="w-full p-2 bg-gray-600 text-yellow-500 rounded-lg"
        placeholder="Route"
        required
      />
      <input
        type="datetime-local"
        value={formData.departure_time}
        onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
        className="w-full p-2 bg-gray-600 text-yellow-500 rounded-lg"
        required
      />
      <input
        type="datetime-local"
        value={formData.arrival_time}
        onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
        className="w-full p-2 bg-gray-600 text-yellow-500 rounded-lg"
        required
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
      >
        Add Bus
      </button>
    </form>
  );
}