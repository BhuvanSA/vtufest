"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                await fetch("/api/logout", { method: "POST" });
            } finally {
                // Could show animation, then redirect after a short delay
                setTimeout(() => {
                    router.replace("/auth/signin");
                }, 1000);
            }
        })();
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            {/* Logging out animation goes here */}
            <p className=" text-white">Logging out...</p>
        </div>
    );
}
