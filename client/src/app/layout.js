"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNav from "../components/AdminNav";
import DriverNav from "../components/DriverNav";
import UserNav from "../components/UserNav";
import GuestNav from "../components/GuestNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch role from localStorage or cookies
    const storedRole = localStorage.getItem("role"); // Assuming role is stored in localStorage
    if (storedRole) {
      setRole(storedRole);

      // Redirect based on role
      switch (storedRole) {
        case "admin":
          router.push("/adminhomepage");
          break;
        case "driver":
          router.push("/driverhomepage");
          break;
        case "user":
          router.push("/userhomepage");
          break;
        default:
          router.push("/"); // Guest homepage
          break;
      }
    } else {
      router.push("/"); // Redirect to signup if no role is found
    }
  }, [router]);

  const renderNav = () => {
    switch (role) {
      case "admin":
        return <AdminNav />;
      case "driver":
        return <DriverNav />;
      case "user":
        return <UserNav />;
      default:
        return <GuestNav />;
    }
  };

  return (
    <html lang="en">
      <head>
        <title>Book Bus</title>
        <meta name="description" content="Bus booking and management platform" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Navigation */}
        {renderNav()}

        {/* Main Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}