import React from "react";
import Link from "next/link";
import Image from "next/image";

// Import logos (ensure these paths match your project structure)
import gatLogo from "@/public/images/gat-logo.png";
import vtulogo from "@/public/images/vtulogo.png";
import LoginLogoutButton from "./LoginLogoutButton";

// Define a common style string for all navigation buttons
const buttonClasses =
  "px-5 py-2.5 border border-transparent rounded-lg font-bold text-black transition-all duration-300 hover:scale-105 hover:border-black hover:bg-red/20 hover:shadow-lg";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-md">
      {/* Left side: Logos and Back to Home Button */}
      <div className="flex items-center space-x-4">
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
        <Link href="https://vtufestinteract.com"
         className="ml-2 px-4 py-2 bg-gradient-to-r from-red-600 via-[#800000] to-red-900 text-yellow-300 font-bold rounded-lg text-base">
          Back to Home
        </Link>
      </div>

      {/* Center: Navigation Buttons */}
      <div className="flex items-center space-x-4">
        <Link href="/our-team" className={buttonClasses}>
          Our Team
        </Link>
        <Link href="/auth/instructions" className={buttonClasses}>
          Registration Instructions
        </Link>
        <Link href="/faqs" className={buttonClasses}>
          FAQs
        </Link>
      </div>

      {/* Right side: Login/Logout Button */}
      <div className="flex items-center space-x-4">
        <LoginLogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;
