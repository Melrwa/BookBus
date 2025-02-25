'use client';

import { useState } from 'react';

export default function DriverManagement() {
  const [search, setSearch] = useState('');
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: 'Karisa Kahindi',
      age: 45,
      gender: 'Male',
      license: 'KE877YYY',
      bus: 'NRBMSA01',
      route: 'Nairobi - Mombasa',
      accidentRecord: 0,
      experience: 10,
      image: 'https://stnonline.com/wp-content/uploads/2015/04/k2_items_src_e58d42f82a9120032ff35dd8f298a4c0.jpg',
    },
    {
      id: 2,
      name: 'Justin Mwakio',
      age: 40,
      gender: 'Male',
      license: 'KE100B34',
      bus: 'KSMELD001',
      route: 'Kisumu - Eldoret',
      accidentRecord: 0,
      experience: 7,
      image: 'https://images.pexels.com/photos/30141803/pexels-photo-30141803/free-photo-of-bus-driver-checking-phone-in-city-traffic.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ]);

  const [modal, setModal] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const openModal = (type, driver) => {
    setSelectedDriver(driver);
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setSelectedDriver(null);
  };

  const confirmDelete = (id) => {
    setModal('confirmDelete');
    setSelectedDriver(drivers.find(driver => driver.id === id));
  };

  const deleteDriver = () => {
    setDrivers(drivers.filter((driver) => driver.id !== selectedDriver.id));
    closeModal();
  };

  const addDriver = (newDriver) => {
    setDrivers([...drivers, { id: drivers.length + 1, ...newDriver }]);
    closeModal();
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(search.toLowerCase()) ||
    driver.route.toLowerCase().includes(search.toLowerCase()) ||
    driver.bus.toLowerCase().includes(search.toLowerCase())
  );

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
        <button className="bg-green-600 px-4 py-2 rounded-lg text-yellow-500">Add Driver</button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredDrivers.map((driver) => (
          <div key={driver.id} className="bg-gray-500 p-4 rounded-lg border border-gray-700">
            <img src={driver.image} alt={driver.name} className="w-full h-70 object-cover rounded-lg" />
            <div className="mt-2">
              <p><strong>Name:</strong> <span className="text-yellow-500">{driver.name}</span></p>
              <p><strong>Age:</strong> <span className="text-yellow-500">{driver.age}</span> | Gender:<span className="text-yellow-500">{driver.gender}</span></p>
              <p><strong>License No:</strong> <span className="text-yellow-500">{driver.license}</span></p>
              <p><strong>Bus:</strong> <span className="text-yellow-500">{driver.bus}</span></p>
              <p><strong>Route:</strong> <span className="text-yellow-500">{driver.route}</span></p>
              <p><strong>Accident Record:</strong> <span className="text-yellow-500">{driver.accidentRecord}</span></p>
              <p><strong>Years of Experience:</strong> <span className="text-yellow-500">{driver.experience}</span></p>
            </div>
            <div className="flex justify-between mt-3">
              <button className="bg-blue-500 px-4 py-2 rounded-lg text-yellow-500" onClick={() => openModal('assign', driver)}>Assign</button>
              <button className="bg-green-500 px-4 py-2 rounded-lg text-yellow-500" onClick={() => openModal('update', driver)}>Update</button>
              <button className="bg-red-500 px-4 py-2 rounded-lg text-yellow-500" onClick={() => confirmDelete(driver.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal === 'assign' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold">Assign Driver</h2>
            <input type="text" placeholder="Bus" className="w-full p-2 my-2 bg-gray-700" />
            <input type="text" placeholder="Route" className="w-full p-2 my-2 bg-gray-700" />
            <button className="bg-blue-500 px-4 py-2 rounded-lg" onClick={closeModal}>Assign</button>
          </div>
        </div>
      )}

      {modal === 'update' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold">Update Driver</h2>
            <input type="text" value={selectedDriver?.name} className="w-full p-2 my-2 bg-gray-700" />
            <input type="text" value={selectedDriver?.bus} className="w-full p-2 my-2 bg-gray-700" />
            <input type="text" value={selectedDriver?.route} className="w-full p-2 my-2 bg-gray-700" />
            <button className="bg-green-500 px-4 py-2 rounded-lg" onClick={closeModal}>Update</button>
          </div>
        </div>
      )}

      {modal === 'confirmDelete' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold">Are you sure you want to delete {selectedDriver?.name}?</h2>
            <div className="flex justify-between mt-4">
              <button className="bg-red-500 px-4 py-2 rounded-lg" onClick={deleteDriver}>Delete</button>
              <button className="bg-gray-500 px-4 py-2 rounded-lg" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
        {modal === 'addDriver' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-bold">Add Driver</h2>
            <input type="text" placeholder="Name" className="w-full p-2 my-2 bg-gray-700" />
            <input type="text" placeholder="Bus" className="w-full p-2 my-2 bg-gray-700" />
            <input type="text" placeholder="Route" className="w-full p-2 my-2 bg-gray-700" />
            <button className="bg-green-500 px-4 py-2 rounded-lg" onClick={closeModal}>Add</button>
          </div>
        </div>
      )}
    </div>
  );
}
