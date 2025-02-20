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
                <>
                    <Link
                        href="/register/getallregister"
                        className="px-4 py-2 bg-gradient-to-r from-red-600 via-[#800000] to-red-900 text-yellow-300 font-bold rounded-lg text-base"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/auth/logout"
                        className="mx-2 px-4 py-2 bg-gradient-to-r from-red-600 via-[#800000] to-red-900 text-yellow-300 font-bold rounded-lg text-base"
                    >
                        Logout
                    </Link>
                </>
            ) : (
                <>
                    <Link
                        href="/auth/signin"
                        className="px-4 py-2 bg-gradient-to-r from-red-600 via-[#800000] to-red-900 text-yellow-300 font-bold rounded-lg text-base"
                    >
                        Login
                    </Link>
                </>
            )}
        </div>
    );
};

export default LoginLogoutButton;
