"use client"

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react"; // Icons for mobile toggle

// Import logos (ensure these paths match your project structure)
import gatLogo from "@/public/images/gat-logo.png";
import vtulogo from "@/public/images/vtulogo.png";
import LoginLogoutButton from "./LoginLogoutButton";

// Define a common style string for all navigation buttons
const buttonClasses =
  "px-5 py-2.5 border border-transparent rounded-lg font-bold text-black transition-all duration-300 hover:scale-105 hover:border-black hover:bg-red/20 hover:shadow-lg";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Increased height from h-16 to h-20 */}
        <div className="flex items-center justify-between h-20">
          {/* Left side: Logos and Back to Home Button */}
          <div className="flex items-center space-x-4">
            <Image
              src={gatLogo}
              alt="GAT Logo"
              width={80}
              height={100}
              className="object-contain"
            />
            <Image
              src={vtulogo}
              alt="VTU Logo"
              width={80}
              height={80}
              className="object-contain"
            />
            <Link
              href="https://vtufestinteract.com"
              className="ml-2 px-4 py-2 bg-gradient-to-r from-red-600 via-[#800000] to-red-900 text-yellow-300 font-bold rounded-lg text-base"
            >
              Back to Home
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/auth/teampage" className={buttonClasses}>
              Our Team
            </Link>
            <Link href="/auth/instructions" className={buttonClasses}>
              Registration Instructions
            </Link>
            <Link href="/faqs" className={buttonClasses}>
              FAQs
            </Link>
          </div>

          {/* Right side: Login/Logout and Mobile Menu Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <LoginLogoutButton />
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="text-black focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/our-team" className={`${buttonClasses} block`}>
              Our Team
            </Link>
            <Link href="/auth/instructions" className={`${buttonClasses} block`}>
              Registration Instructions
            </Link>
            <Link href="/faqs" className={`${buttonClasses} block`}>
              FAQs
            </Link>
            <div className="pt-2">
              <LoginLogoutButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
