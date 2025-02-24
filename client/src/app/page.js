export default function Home() {
    return (
      <div className="bg-black text-white min-h-screen">
        {/* Navbar */}
        <nav className="bg-gray-900 py-4 px-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-white">Book Bus</div>
          <div className="flex gap-6">
            <a href="#" className="text-white hover:text-yellow-500">Home</a>
            <a href="#" className="text-white hover:text-yellow-500">Bookings</a>
            <a href="#" className="text-white hover:text-yellow-500">About Us</a>
            <a href="#" className="text-white hover:text-yellow-500">Contacts</a>
          </div>
          <div className="flex gap-4">
            <button className="bg-[#F4A900] text-black px-4 py-2 rounded">Sign Up</button>
            <button className="bg-[#F4A900] text-black px-4 py-2 rounded">Login</button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative h-[400px] bg-cover bg-center" style={{ backgroundImage: "url('/bus-background.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
            <h1 className="text-3xl font-bold text-yellow-500">Bus Booking Services</h1>
            <p className="text-lg">Home - Bookings</p>
            <div className="mt-6 bg-gray-900 p-4 rounded-lg flex flex-wrap gap-4">
              <input type="text" placeholder="Traveling From" className="p-2 rounded w-40 text-black" />
              <input type="text" placeholder="Traveling To" className="p-2 rounded w-40 text-black" />
              <input type="date" className="p-2 rounded w-40 text-black" />
              <button className="bg-[#F4A900] px-4 py-2 rounded">Search</button>
            </div>
          </div>
        </div>

        {/* Dummy Bus Search Results */}
        <div className="container mx-auto p-4 mt-6">
          <h2 className="text-2xl font-bold text-yellow-500">Available Buses</h2>
          <div className="bg-gray-800 p-4 rounded-lg mt-4">
            <h3 className="text-xl">Mombasa → Nairobi</h3>
            <p>Departure: 21:00 hrs | Arrival: 05:00 hrs</p>
            <p className="text-green-400">VIP: kshs 1800</p>
            <p className="text-red-400">Business: kshs 1600</p>
            <button className="bg-red-500 px-4 py-2 mt-2 rounded">Select</button>
          </div>
        </div>

        {/* About Us Section */}
        <div className="bg-gray-900 p-8 mt-10 text-center">
          <h2 className="text-2xl font-bold text-yellow-500">About Us</h2>
          <p className="mt-4 text-lg">We provide seamless and affordable bus travel across major cities.</p>
          <h3 className="mt-6 text-lg font-semibold">Contact Us</h3>
          <p>Email: support@busbooking.com</p>
          <p>Phone: +254 700 000 000</p>
        </div>
      </div>
    );
  }
