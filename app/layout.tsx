"use client"
import React, { ReactNode, useEffect } from "react";
import Navbar from ".././components/Navbar";
import Footer from ".././components/Footer";
import "./globals.css";

// Global layout for pages
const Layout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Remove unwanted attributes injected by browser extensions
    document.body.removeAttribute("data-gr-ext-installed");
    document.body.removeAttribute("data-new-gr-c-s-check-loaded");
  }, []);

  return (
    <html lang="en">
      <head>
        {/* You can add custom head tags here, like meta tags, link to styles, etc. */}
      </head>
      <body>
        <Navbar />
        <main className="flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
