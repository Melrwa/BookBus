'use client';

import { useState, useEffect } from 'react';

export default function DriverManagement() {
  const [search, setSearch] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch drivers from the backend
  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/admin/drivers', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch drivers when the component mounts
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Open modal for edit, delete, or assign
  const openModal = (type, driver) => {
    setSelectedDriver(driver);
    setModal(type);
  };

  // Close modal
  const closeModal = () => {
    setModal(null);
    setSelectedDriver(null);
    setError(null);
    setSuccessMessage(null);
  };

  // Delete a driver
  const deleteDriver = async () => {
    try {
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted driver from the state
      setDrivers(drivers.filter((driver) => driver.id !== selectedDriver.id));
      setSuccessMessage('Driver deleted successfully!');
      closeModal();
    } catch (error) {
      console.error('Error deleting driver:', error);
      setError(error.message);
    }
  };

  // Add a driver
  const addDriver = async (newDriver) => {
    try {
      const response = await fetch('/api/admin/add_driver', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDriver),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDrivers([...drivers, data]); // Add the new driver to the state
      setSuccessMessage('Driver added successfully!');
      closeModal();
    } catch (error) {
      console.error('Error adding driver:', error);
      setError(error.message);
    }
  };

  // Assign a driver to a bus
  const assignDriverToBus = async (driverId, busId) => {
    try {
      const response = await fetch('/api/admin/assign_driver', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driver_id: driverId, bus_id: busId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Update the driver's bus in the state
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver.id === driverId
            ? { ...driver, buses: [data.bus] } // Update with the new bus assignment
            : driver
        )
      );

      setSuccessMessage('Driver assigned to bus successfully!');
      closeModal();
    } catch (error) {
      console.error('Error assigning driver to bus:', error);
      setError(error.message);
    }
  };

  // Filter drivers based on search
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(search.toLowerCase()) ||
      driver.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-white text-center">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold text-yellow-500 text-center mb-4">Driver’s Information</h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-2 w-full max-w-lg">
          <input
            type="text"
            placeholder="Search"
            className="p-2 w-full rounded bg-black text-yellow-500 border border-yellow-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-yellow-400 px-4 py-2 rounded-lg text-black">Search</button>
        </div>
        <button
          className="bg-green-600 px-4 py-2 rounded-lg text-yellow-500"
          onClick={() => openModal('addDriver', null)}
        >
          Add Driver
        </button>
      </div>

      {successMessage && (
        <div className="bg-green-500 text-white p-4 rounded-lg mb-4">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-gray-800 p-4 rounded-lg border border-yellow-500">
            <div className="mt-2">
              <p>
                <strong>Name:</strong> <span className="text-yellow-500">{driver.name}</span>
              </p>
              <p>
                <strong>Email:</strong> <span className="text-yellow-500">{driver.email}</span>
              </p>
              <p>
                <strong>Role:</strong> <span className="text-yellow-500">{driver.role}</span>
              </p>
              <p>
                <strong>Bus:</strong>
                {driver.buses && driver.buses.length > 0 ? (
                  driver.buses.map((bus) => (
                    <span key={bus.id} className="text-yellow-500">
                      {bus.route} (ID: {bus.id})
                    </span>
                  ))
                ) : (
                  <span className="text-yellow-500">Unassigned</span>
                )}
              </p>
            </div>
            <div className="flex justify-between mt-3">
              <button
                className="bg-blue-500 px-4 py-2 rounded-lg text-yellow-500"
                onClick={() => openModal('assign', driver)}
              >
                Assign
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded-lg text-yellow-500"
                onClick={() => openModal('confirmDelete', driver)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Driver Modal */}
      {modal === 'addDriver' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold">Add Driver</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newDriver = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  password: formData.get('password'),
                };
                addDriver(newDriver);
              }}
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-2 my-2 bg-gray-700"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 my-2 bg-gray-700"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-2 my-2 bg-gray-700"
                required
              />
              <button type="submit" className="bg-green-500 px-4 py-2 rounded-lg">
                Add Driver
              </button>
              <button
                type="button"
                className="bg-gray-500 px-4 py-2 rounded-lg ml-2"
                onClick={closeModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Assign Driver Modal */}
      {modal === 'assign' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold">Assign Driver to Bus</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const busId = formData.get('busId');
                assignDriverToBus(selectedDriver.id, busId);
              }}
            >
              <input
                type="text"
                name="busId"
                placeholder="Bus ID"
                className="w-full p-2 my-2 bg-gray-700"
                required
              />
              <button type="submit" className="bg-blue-500 px-4 py-2 rounded-lg">
                Assign
              </button>
              <button
                type="button"
                className="bg-gray-500 px-4 py-2 rounded-lg ml-2"
                onClick={closeModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal === 'confirmDelete' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold">
              Are you sure you want to delete {selectedDriver?.name}?
            </h2>
            <div className="flex justify-between mt-4">
              <button className="bg-red-500 px-4 py-2 rounded-lg" onClick={deleteDriver}>
                Delete
              </button>
              <button className="bg-gray-500 px-4 py-2 rounded-lg" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}