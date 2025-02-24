// import React from 'react'

// export default function Bookings() {
//   return (
//     <div>
//       Bookings
//     </div>
//   )
// }


export default function Bookings() {
    const bookings = [
      {
        bus: "NRB/MSA01",
        seat: "35",
        class: "Business",
        fromTo: "Nairobi ==> Mombasa",
        dateTime: "19/02/2024 | 3:00",
        price: "kshs 3000",
      },
      {
        bus: "NRB/KSM01",
        seat: "05",
        class: "First",
        fromTo: "Nairobi ==> Kisumu",
        dateTime: "09/06/2024 | 5:00",
        price: "kshs 5000",
      },
      {
        bus: "NRB/NAKURU04",
        seat: "36",
        class: "Business",
        fromTo: "Nakuru ==> Nairobi",
        dateTime: "25/04/2024 | 10:00",
        price: "kshs 1500",
      },
    ];

    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
        <h1 className="text-[#F4A900] text-2xl font-bold mb-6">Your Bookings</h1>

        {bookings.map((booking, index) => (
          <div key={index} className="bg-gray-900 w-full max-w-3xl p-4 rounded-lg shadow-lg mb-4">
            <div className="grid grid-cols-6 text-sm font-semibold text-[#F4A900] border-b border-gray-700 pb-2">
              <span>Bus Booked</span>
              <span>Seat Number</span>
              <span>Class</span>
              <span>From-To</span>
              <span>Date/Time</span>
              <span>Price</span>
            </div>

            <div className="grid grid-cols-6 text-sm text-white py-2">
              <span className="text-[#F4A900]">{booking.bus}</span>
              <span>{booking.seat}</span>
              <span>{booking.class}</span>
              <span className="text-[#F4A900]">{booking.fromTo}</span>
              <span>{booking.dateTime}</span>
              <span>{booking.price}</span>
            </div>

            <div className="flex justify-end mt-2 space-x-2">
              <button className="bg-green-600 text-black px-3 py-1 rounded">Edit</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
