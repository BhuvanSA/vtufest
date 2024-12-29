"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

type AuthContextProviderProps = {
    children: React.ReactNode;
};

type AuthContext = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    checkAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContext | null>(null);

export default function AuthContextProvider({
    children,
}: AuthContextProviderProps) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await fetch("/api/checkAuth");
            setIsLoggedIn(response.ok);
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error(
            "useAuthContext must be used within an AuthContextProvider"
        );
    }
    return context;
}
