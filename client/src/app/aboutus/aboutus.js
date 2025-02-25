// import React from 'react'

// export default function Aboutus() {
//   return (
//     <div>
//       Aboutus
//     </div>
//   )
// }


import Image from "next/image";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-center text-3xl font-bold text-[#F4A900] mb-8">
        About Us
      </h1>

      {/* Top Row: Mission and Vision */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg text-center flex flex-col">
          <Image
            src="/bus-mission.jpg" // Replace with actual image
            alt="Mission"
            width={500}
            height={250}
            className="rounded-lg mx-auto"
          />
          <h2 className="text-2xl font-semibold text-[#F4A900] mt-4">Our Mission</h2>
          <p className="mt-2 text-gray-300">
            Our mission is to provide a seamless and efficient bus booking experience,
            ensuring convenience, affordability, and comfort for all our users.
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg text-center flex flex-col">
          <Image
            src="/bus-vision.jpg" // Replace with actual image
            alt="Vision"
            width={500}
            height={250}
            className="rounded-lg mx-auto"
          />
          <h2 className="text-2xl font-semibold text-[#F4A900] mt-4">Our Vision</h2>
          <p className="mt-2 text-gray-300">
            We envision a future where travel is hassle-free, with a modernized bus booking system that enhances accessibility, reliability, and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Bottom Row: About Us */}
      <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-lg text-center mt-8">
        <Image
          src="/bus-about.jpg" // Replace with actual image
          alt="About Us"
          width={600}
          height={300}
          className="rounded-lg mx-auto"
        />
        <h2 className="text-3xl font-semibold text-[#F4A900] mt-6">Who We Are</h2>
        <p className="mt-4 text-gray-300 max-w-3xl mx-auto">
          We are a dedicated platform designed to simplify bus bookings by offering a user-friendly interface, real-time updates, and secure transactions. Our goal is to connect passengers with trusted bus operators for a smooth travel experience.
        </p>
      </div>
    </div>
  );
}
