import React from "react";
import Navbar from "../components/Navbar";
import Footer from ".././components/Footer";
import "./globals.css";
import AuthContextProvider from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-provider";

// Global layout for pages
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* You can add custom head tags here, like meta tags, link to styles, etc. */}
            </head>
            <body className="bg-background text-foreground dark:bg-background dark:text-foreground">
                <ThemeProvider>
                    <AuthContextProvider>
                        <Navbar />
                    </AuthContextProvider>
                    <main className="pt-20">{children}</main>
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
};

export default Layout;
