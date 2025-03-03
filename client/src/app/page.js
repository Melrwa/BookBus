
export default function Home() {
    return (
        <div className="bg-black text-white min-h-screen">
            {/* Hero Section */}
                     <div
                    className="relative h-[400px] bg-cover bg-center"
                    style={{ backgroundImage: "url('https://res.cloudinary.com/dbujmywdy/image/upload/v1740398298/360_F_780280283_px55r99HxNSvCdLgm8dtw3otS8L5KMZw_augjb2.jpg')" }}
                    >
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

            {/* Bus Search Results */}
            <div className="container mx-auto p-4 mt-6">
                <h2 className="text-2xl font-bold text-yellow-500">Available Buses</h2>
                <div className="bg-gray-800 p-6 rounded-lg mt-4 flex flex-col gap-2 border border-gray-700">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-semibold">Mombasa → Nairobi</h3>
                            <p>Departure: <span className="font-semibold">21:00 hrs</span> | Arrival: <span className="font-semibold">05:00 hrs</span></p>
                        </div>
                        <span className="text-yellow-400 font-bold">8 hrs</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <div>
                            <p className="text-green-400 font-semibold">VIP: kshs 1800</p>
                            <p className="text-red-400 font-semibold">Normal: kshs 1600</p>
                        </div>
                        <a href ="/bookingbus" className="bg-red-500 px-4 py-2 rounded">Select</a>
                    </div>
                    <p className="text-white text-sm mt-2">Available Seats: <span className="bg-red-600 px-2 py-1 rounded text-white">23</span></p>
                </div>
            </div>

            {/* About Us Section */}
            <div className="bg-gray-900 p-8 mt-10 text-center">
                <h3 className="text-2xl font-bold text-yellow-500">Contact Us</h3>
                <p>Email: support@busbooking.com</p>
                <p>Phone: +254 700 000 000</p>
            </div>
        </div>
    );
}
