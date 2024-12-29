"use client";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from ".././components/Footer";
import "./globals.css";
import AuthContextProvider from "@/contexts/auth-context";

// Global layout for pages
const Layout = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Remove unwanted attributes injected by browser extensions
        document.body.removeAttribute("data-gr-ext-installed");
        document.body.removeAttribute("data-new-gr-c-s-check-loaded");
    }, []);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* You can add custom head tags here, like meta tags, link to styles, etc. */}
            </head>
            <body>
                <AuthContextProvider>
                    <Navbar />
                    <div className="mt-28">
                        <main className="flex flex-col ">{children}</main>
                    </div>
                    <Footer />
                </AuthContextProvider>
            </body>
        </html>
    );
};

export default Layout;
