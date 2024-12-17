// app/home/page.tsx
import React from "react";
import Image from "next/image";
import "./globals.css"; // Adjust the import path as needed
import Header from "@/components/Header";

const Home = () => {
    return (
        <>
            <Header />
            <section id="home" className="text-center py-8">
                {/* Heading and Description */}
                <h2 className="text-6xl font-bold mt-8">
                    Welcome to VTU Youth Fest 2025
                </h2>
                <p className="text-lg text-2xl mt-4">
                    Join us in a grand celebration of culture, creativity, and
                    excellence!
                </p>
            </section>
        </>
    );
};

export default Home;
