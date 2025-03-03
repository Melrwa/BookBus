import Link from "next/link";

export default function DriverNav() {
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
      <div className="space-x-6">
          <a href="/Home" className="hover:text-yellow-400 text-white">Home</a>
          <a href="/Buses" className="hover:text-yellow-400 text-white">Buses</a>
          <a href="/Profile" className="hover:text-yellow-400 text-white">Profile</a>
        </div>
      <div className="space-x-4 text">
        <Link href="/driverhomepage">Home</Link>
        <Link href="/buses">Buses</Link>
        <Link  className="bg-yellow-500 text-black px-4 py-2 rounded" href="/logout">Logout</Link>
      </div>
    </nav>
  );
}