// import React from 'react'

// export default function Addbuses() {
//   return (
//     <div>
//       Addbuses
//     </div>
//   )
// }


export default function RegisterBus() {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-[#F4A900] text-xl font-semibold text-center mb-6">
            Register a New Bus
          </h2>
          <form className="space-y-4">
            <div>
              <label className="text-[#F4A900] block mb-1">Bus Company</label>
              <input type="text" className="w-full p-2 rounded bg-gray-700 text-white" />
            </div>
            <div>
              <label className="text-[#F4A900] block mb-1">Bus Name</label>
              <input type="text" className="w-full p-2 rounded bg-gray-700 text-white" />
            </div>
            <div>
              <label className="text-[#F4A900] block mb-1">Number of Seats</label>
              <input type="number" className="w-full p-2 rounded bg-gray-700 text-white" />
            </div>
            <div>
              <label className="text-[#F4A900] block mb-1">Cost Per Seat</label>
              <input type="number" className="w-full p-2 rounded bg-gray-700 text-white" />
            </div>
            <div>
              <label className="text-[#F4A900] block mb-1">Route</label>
              <input type="text" className="w-full p-2 rounded bg-gray-700 text-white" />
            </div>
            <div>
              <label className="text-[#F4A900] block mb-1">Time Of Travel</label>
              <input type="time" className="w-full p-2 rounded bg-gray-700 text-white" />
            </div>
            <button type="submit" className="w-full bg-[#F4A900] text-black p-2 rounded font-semibold">
              Register
            </button>
          </form>
        </div>
      </div>
    );
  }
