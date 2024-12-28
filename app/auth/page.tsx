"use client";

import { useState } from "react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

export default function AuthPage() {
    const [isSignIn, setIsSignIn] = useState(true);

    const handleSwitch = () => {
        setIsSignIn((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {isSignIn ? (
                    <SignInForm onSwitch={handleSwitch} />
                ) : (
                    <SignUpForm onSwitch={handleSwitch} />
                )}
            </div>
        </div>
    );
}
