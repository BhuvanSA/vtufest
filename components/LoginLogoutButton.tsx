"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-context";

const LoginLogoutButton = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuthContext();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", {
                method: "POST",
            });
            const data = await res.json();
            if (data.success) {
                setIsLoggedIn(false);
                router.push("/auth/signin");
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout", error);
        }
    };

    return (
        <div>
            {isLoggedIn ? (
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 via-[#800000] to-red-900 text-yellow-300 font-bold rounded-lg text-base"
                >
                    Logout
                </button>
            ) : (
                <Link
                    href="/auth/signin"
                    className="px-4 py-2 bg-gradient-to-r from-red-600 via-[#800000] to-red-900 text-yellow-300 font-bold rounded-lg text-base"
                >
                    Login
                </Link>
            )}
        </div>
    );
};

export default LoginLogoutButton;
