// import React from 'react'

// export default function Driverhomepage() {
//   return (
//     <div>
//       Driverhomepage
//     </div>
//   )
// }


import Image from 'next/image';
import Link from 'next/link';

export default function DriverHomePage() {
  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-black text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Book Bus" width={50} height={50} />
          <h1 className="ml-2 text-xl font-bold">Book Bus</h1>
        </div>
        <nav className="flex space-x-6">
          <Link href="#"><span className="text-white">Home</span></Link>
          <Link href="#"><span className="text-white">Buses</span></Link>
          <Link href="#"><span className="text-white">Profile</span></Link>
        </nav>
        <button className="bg-[#F4A900] text-black px-4 py-2 rounded">Logout</button>
      </header>

      {/* Bus Image */}
      <div className="w-full max-w-4xl mt-6">
        <Image src="/bus.jpg" alt="Bus" width={800} height={400} className="rounded" />
      </div>

      {/* Bus Details */}
      <div className="mt-4 bg-black text-[#F4A900] px-6 py-2 text-center text-xl font-bold">NRBMSA01</div>

      {/* Capacity Details */}
      <div className="flex justify-center mt-4 space-x-8">
        <div className="text-center bg-gray-800 text-white px-4 py-2 rounded">
          <p className="text-lg">Capacity</p>
          <p className="text-xl font-bold text-[#F4A900]">55</p>
        </div>
        <div className="text-center bg-gray-800 text-white px-4 py-2 rounded">
          <p className="text-lg">Booked</p>
          <p className="text-xl font-bold text-[#F4A900]">20</p>
        </div>
        <div className="text-center bg-gray-800 text-white px-4 py-2 rounded">
          <p className="text-lg">Available</p>
          <p className="text-xl font-bold text-[#F4A900]">35</p>
        </div>
      </div>
    </div>
  );
}