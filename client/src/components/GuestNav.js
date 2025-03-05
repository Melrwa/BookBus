import Link from "next/link";

export default function GuestNav() {
  return (
    <nav className="bg-black py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img
          src="https://res.cloudinary.com/dbujmywdy/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1740389136/minimal-abstract-logo-bus-icon-school-bus-vector-silhouette-isolated-design-template_653669-2867_u57azg.jpg"
          alt="Bus Logo"
          className="h-10"
        />
        <div className="flex flex-col text-white">
          <span className="text-xl font-bold">Book</span>
          <span className="text-xl font-bold">Bus</span>
        </div>
      </div>
      <div className="space-x-4 text-white">
        <Link className="hover:text-yellow-500" href="/">Home</Link>
        <Link className="hover:text-yellow-500" href="/bookings">Bookings</Link>
        <Link className="hover:text-yellow-500" href="/aboutus">About</Link>
      </div>
      <div className="space-x-4 text-white">
        <button><Link className=" hover:bg-yellow-700 bg-[#F4A900] text-black px-4 py-2 rounded" href="/signup">Sign Up</Link></button>
       <button> <Link className=" hover:bg-yellow-700 bg-[#F4A900] text-black px-4 py-2 rounded" href="/login">Login</Link></button>
      </div>
    </nav>
  );
}