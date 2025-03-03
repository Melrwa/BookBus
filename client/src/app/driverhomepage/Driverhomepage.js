"use client";

import React from "react";

const DriverHomePage = () => {
  return (
    <div className="bg-black min-h-screen text-white">
    

      {/* Bus Details */}
      <div className="max-w-4xl mxmt-8 bg-gray-900 rounded-lg p-4">
        <img
          src="/bus-image.jpg"
          alt="Bus"
          className="w-full h-80 object-cover rounded"
        />
        <div className="text-center my-4 bg-black text-yellow-500 text-lg font-bold py-2">
          NRBMSA01
        </div>
        <div className="grid grid-cols-3 gap-4 text-center bg-gray-800 p-4 rounded">
          <div>
            <p className="text-white">Capacity</p>
            <p className="text-yellow-400 text-xl font-bold">55</p>
          </div>
          <div>
            <p className="text-white">Booked</p>
            <p className="text-yellow-400 text-xl font-bold">20</p>
          </div>
          <div>
            <p className="text-white">Available</p>
            <p className="text-yellow-400 text-xl font-bold">35</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverHomePage;
