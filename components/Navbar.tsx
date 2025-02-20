"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Import logos (ensure these paths match your project structure)
import gatLogo from "@/public/images/gat-logo.png";
import vtulogo from "@/public/images/vtulogo.png";

const Navbar = () => {
  // Manage authentication state based on a token (or your auth logic)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check for an authentication token when the component mounts
  useEffect(() => {
    // Replace this with your actual auth check logic
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Replace with your logout logic (e.g., clearing cookies or context)
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <nav className="flex items-center justify-between px-4 py-6 bg-gradient-to-r from-yellow-400 to-yellow-600">
      {/* Left side: Logos and Back to Home Button */}
      <div className="flex items-center space-x-3">
        <Image
          src={gatLogo}
          alt="GAT Logo"
          width={100}
          height={100}
          className="object-contain"
        />
        <Image
          src={vtulogo}
          alt="VTU Logo"
          width={90}
          height={90}
          className="object-contain"
        />
        <Link
          href="https://vtufestinteract.com"
          className="ml-2 px-4 py-2 bg-gradient-to-r from-red-600 via-[#800000] to-red-900 text-yellow-300 font-bold rounded-lg text-base"
        >
          Back to Home
        </Link>
      </div>

      {/* Right side: Navigation Buttons */}
      <div className="flex items-center space-x-3">
        {isLoggedIn ? (
          <>
            <Link
              href="/app/register/getallregister"
              className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-base"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 text-white font-bold rounded-lg text-base"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/auth/signin"
            className="px-4 py-2 bg-gradient-to-r from-red-600 via-[#800000] to-red-900 text-yellow-300 font-bold rounded-lg text-base"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

