import React from "react";
import Link from "next/link";
import Image from "next/image";

// Import logos (ensure these paths match your project structure)
import gatLogo from "@/public/images/gat-logo.png";
import vtulogo from "@/public/images/vtulogo.png";
import LoginLogoutButton from "./LoginLogoutButton";

const Navbar = () => {
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
                <LoginLogoutButton />
            </div>
        </nav>
    );
};

export default Navbar;
