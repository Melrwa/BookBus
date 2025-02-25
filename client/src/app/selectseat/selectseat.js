
'use client';
import { useState } from "react";

export default function SeatSelection() {
  const rows = [
    ["VIP", "", "VIP", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["", "", "", ""],
  ];

  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (rowIndex, colIndex) => {
    const seatId = `${rowIndex}-${colIndex}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-3/5">
        <h2 className="text-[#F4A900] text-xl font-semibold text-center mb-6">
          Select Seat
        </h2>
        <div className="flex justify-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-white border"></div>
            <span className="text-white">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-pink-400 border"></div>
            <span className="text-white">VIP</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-blue-500 border"></div>
            <span className="text-white">Business</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-gray-500 border"></div>
            <span className="text-white">Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-red-500 border"></div>
            <span className="text-white">Selected</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-4">
              {row.map((seat, colIndex) => (
                <div
                  key={colIndex}
                  className={`w-10 h-10 flex items-center justify-center border rounded-md cursor-pointer ${
                    seat === "VIP"
                      ? "bg-pink-400"
                      : selectedSeats.includes(`${rowIndex}-${colIndex}`)
                      ? "bg-red-500"
                      : "bg-white"
                  }`}
                  onClick={() => toggleSeat(rowIndex, colIndex)}
                >
                  {rowIndex * 4 + colIndex + 1}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
