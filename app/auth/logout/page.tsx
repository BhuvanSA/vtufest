"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth-context";

export default function LogoutPage() {
    const router = useRouter();
    const { setIsLoggedIn } = useAuthContext();

    useEffect(() => {
        (async () => {
            try {
                await fetch("/api/logout", { method: "POST" });
            } finally {
                router.replace("/auth/signin");
                setIsLoggedIn(false);
            }
        })();
    }, [router, setIsLoggedIn]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            {/* Logging out animation goes here */}
            <p className=" text-white">Logging out...</p>
        </div>
    );
}
