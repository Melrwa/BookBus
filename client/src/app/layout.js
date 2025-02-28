"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSession, refreshToken } from "./lib/auth";
import AdminNav from "../components/AdminNav";
import DriverNav from "../components/DriverNav";
import UserNav  from "../components/UserNav";
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
    async function fetchSession() {
      const user = await checkSession();
      if (user) {
        setRole(user.role);

        // Redirect based on role
        switch (user.role) {
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
        router.push("/signup"); // Redirect to guest homepage if no session
      }
    }

    fetchSession();

    // Set up token refresh logic
    const refreshInterval = setInterval(async () => {
      const newToken = await refreshToken();
      if (!newToken) {
        // Redirect to login if token refresh fails
        router.push("/");
      }
    }, 60 * 60 * 1000); // Refresh every 5 minutes

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
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