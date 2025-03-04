// import React from 'react'

// export default function Aboutus() {
//   return (
//     <div>
//       Aboutus
//     </div>
//   )
// }


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
          <img
            src="https://media.istockphoto.com/id/1189925691/photo/setra-s519hd.jpg?s=612x612&w=0&k=20&c=306VUyVDmK2TY3Qw9xCRtWwranpfgAvXxi25wbe5egs="
            alt="Mission"
            className="rounded-lg w-full h-[250px] object-cover"
          />
          <h2 className="text-2xl font-semibold text-[#F4A900] mt-4">Our Mission</h2>
          <p className="mt-2 text-gray-300">
            Our mission is to provide a seamless and efficient bus booking experience,
            ensuring convenience, affordability, and comfort for all our users.
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg text-center flex flex-col">
          <img
            src="https://thumbs.dreamstime.com/b/modern-black-bus-sleek-design-parked-road-scenic-backdrop-trees-sunset-black-bus-parked-343611580.jpg"
            alt="Vision"
            className="rounded-lg w-full h-[250px] object-cover"
          />
          <h2 className="text-2xl font-semibold text-[#F4A900] mt-4">Our Vision</h2>
          <p className="mt-2 text-gray-300">
            We envision a future where travel is hassle-free, with a modernized bus booking system that enhances accessibility, reliability, and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Bottom Row: About Us */}
      <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-lg text-center mt-8">
        <img
          src="https://static.vecteezy.com/system/resources/previews/037/471/374/non_2x/ai-generated-touristic-coach-bus-on-highway-road-intercity-regional-domestic-transportation-driving-urban-modern-tour-traveling-travel-journey-ride-moving-transport-concept-public-comfortable-photo.jpg"
          alt="About Us"
          className="rounded-lg w-full h-[300px] object-cover"
        />
        <h2 className="text-3xl font-semibold text-[#F4A900] mt-6">Who We Are</h2>
        <p className="mt-4 text-gray-300 max-w-3xl mx-auto">
          We are a dedicated platform designed to simplify bus bookings by offering a user-friendly interface, real-time updates, and secure transactions. Our goal is to connect passengers with trusted bus operators for a smooth travel experience.
        </p>
      </div>
    </div>
  );
}
