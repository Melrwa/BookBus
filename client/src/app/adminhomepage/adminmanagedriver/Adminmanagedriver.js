'use client';

import { useState, useEffect } from 'react';

export default function DriverManagement() {
  const [search, setSearch] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const perPage = 8; // Number of drivers per page

  // Fetch drivers from the backend
  const fetchDrivers = async (page = 1) => {
    try {
      const response = await fetch(`/api/drivers?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDrivers(data.drivers); // Set the fetched drivers
      setTotalPages(data.total_pages); // Set total pages
      setTotalItems(data.total_items); // Set total items
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  // Fetch drivers when the component mounts or the page changes
  useEffect(() => {
    fetchDrivers(currentPage);
  }, [currentPage]);

  // Open modal for edit or delete
  const openModal = (type, driver) => {
    setSelectedDriver(driver);
    setModal(type);
  };

  // Close modal
  const closeModal = () => {
    setModal(null);
    setSelectedDriver(null);
  };

  // Delete a driver
  const deleteDriver = async () => {
    try {
      const response = await fetch(`/api/drivers/${selectedDriver.id}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted driver from the state
      setDrivers(drivers.filter((driver) => driver.id !== selectedDriver.id));
      closeModal();
    } catch (error) {
      console.error('Error deleting driver:', error);
      setError(error.message);
    }
  };

  // Update a driver
  const updateDriver = async (updatedDriver) => {
    try {
      const response = await fetch(`/api/drivers/${selectedDriver.id}`, {
        method: 'PUT',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDriver),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update the driver in the state
      setDrivers(
        drivers.map((driver) =>
          driver.id === selectedDriver.id ? { ...driver, ...updatedDriver } : driver
        )
      );
      closeModal();
    } catch (error) {
      console.error('Error updating driver:', error);
      setError(error.message);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Filter drivers based on search
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(search.toLowerCase()) ||
      driver.route.toLowerCase().includes(search.toLowerCase()) ||
      driver.bus.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-gray-500 p-4 rounded-lg border border-gray-700">
            <img
              src={driver.image || 'https://via.placeholder.com/150'}
              alt={driver.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="mt-2">
              <p>
                <strong>Name:</strong> <span className="text-yellow-500">{driver.name}</span>
              </p>
              <p>
                <strong>Age:</strong> <span className="text-yellow-500">{driver.age}</span> |{' '}
                <strong>Gender:</strong> <span className="text-yellow-500">{driver.gender}</span>
              </p>
              <p>
                <strong>License No:</strong> <span className="text-yellow-500">{driver.license}</span>
              </p>
              <p>
                <strong>Bus:</strong> <span className="text-yellow-500">{driver.bus}</span>
              </p>
              <p>
                <strong>Route:</strong> <span className="text-yellow-500">{driver.route}</span>
              </p>
              <p>
                <strong>Accident Record:</strong>{' '}
                <span className="text-yellow-500">{driver.accidentRecord}</span>
              </p>
              <p>
                <strong>Years of Experience:</strong>{' '}
                <span className="text-yellow-500">{driver.experience}</span>
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
                className="bg-green-500 px-4 py-2 rounded-lg text-yellow-500"
                onClick={() => openModal('update', driver)}
              >
                Update
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          className="bg-yellow-500 px-4 py-2 rounded-lg text-black disabled:bg-gray-500 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-4 text-yellow-500">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-yellow-500 px-4 py-2 rounded-lg text-black disabled:bg-gray-500 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modals */}
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

      {modal === 'update' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold">Update Driver</h2>
            <input
              type="text"
              value={selectedDriver?.name}
              onChange={(e) =>
                setSelectedDriver({ ...selectedDriver, name: e.target.value })
              }
              className="w-full p-2 my-2 bg-gray-700"
            />
            <input
              type="text"
              value={selectedDriver?.bus}
              onChange={(e) =>
                setSelectedDriver({ ...selectedDriver, bus: e.target.value })
              }
              className="w-full p-2 my-2 bg-gray-700"
            />
            <input
              type="text"
              value={selectedDriver?.route}
              onChange={(e) =>
                setSelectedDriver({ ...selectedDriver, route: e.target.value })
              }
              className="w-full p-2 my-2 bg-gray-700"
            />
            <button
              className="bg-green-500 px-4 py-2 rounded-lg"
              onClick={() => updateDriver(selectedDriver)}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}