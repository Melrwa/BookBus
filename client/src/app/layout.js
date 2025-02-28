"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { checkSession } from "./lib/auth";
import AdminNav from "@/components/AdminNav";
import DriverNav from "@/components/DriverNav";
import UserNav from "@/components/UserNav";
import GuestNav from "@/components/GuestNav";

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

  useEffect(() => {
    async function fetchSession() {
      const user = await checkSession();
      if (user) setRole(user.role);
    }
    fetchSession();
  }, []);

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