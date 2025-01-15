import React from "react";
import Navbar from "../components/Navbar";
import Footer from ".././components/Footer";
import "./globals.css";
import AuthContextProvider from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-provider";
import { Toaster } from "sonner";

// Global layout for pages
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* You can add custom head tags here, like meta tags, link to styles, etc. */}
            </head>
            <body>
                <ThemeProvider>
                    <AuthContextProvider>
                        <Navbar />
                        <main className="mt-10 my-10 py-[5rem]">{children}</main>
                        <Toaster />
                        <Footer />
                    </AuthContextProvider>
                </ThemeProvider>
            </body>
        </html>
    );
};

export default Layout;
