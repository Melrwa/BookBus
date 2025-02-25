// import React from 'react'

// export default function Addriver() {
//   return (
//     <div>
//       Addriver
//     </div>
//   )
// }


'use client';

import { useState } from 'react';

export default function AddDriverForm() {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    licenseNumber: '',
    assignedBus: '',
    route: '',
    accidentRecord: '',
    experience: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-center text-yellow-500 text-2xl font-bold mb-4">Add Driver Form</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: 'Name', name: 'name' },
            { label: 'Date Of Birth', name: 'dateOfBirth', type: 'date' },
            { label: 'Gender', name: 'gender' },
            { label: 'License Number', name: 'licenseNumber' },
            { label: 'Assigned Bus', name: 'assignedBus' },
            { label: 'Route', name: 'route' },
            { label: 'Accident Record', name: 'accidentRecord' },
            { label: 'Years Of Experience', name: 'experience', type: 'number' }
          ].map(({ label, name, type = 'text' }) => (
            <div key={name}>
              <label className="block text-yellow-500 font-semibold">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full p-2 mt-1 rounded bg-gray-300 text-black focus:outline-none"
                required
              />
            </div>
          ))}
          <button type="submit" className="bg-green-600 text-white p-2 rounded mt-4 hover:bg-green-700">
            Add Driver
          </button>
        </form>
      </div>
    </div>
  );
}
