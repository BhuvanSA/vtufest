// app/home/page.tsx
import React from "react";
import Image from "next/image";
import "./globals.css"; // Adjust the import path as needed

const Home = () => {
    return (
        <section id="home" className="text-center py-8">
            {/* Banner Image */}
            <div className="banner">
                <Image
                    src="/images/banner.jpg" // Ensure the image is in the public folder or adjust the path
                    alt="VTU Youth Fest 2025 Banner"
                    width={1920} // Replace with the actual width of the image
                    height={600} // Replace with the actual height of the image
                    className="banner-image w-full"
                />
            </div>

            {/* Heading and Description */}
            <h2 className="text-6xl font-bold mt-8">
                Welcome to VTU Youth Fest 2025
            </h2>
            <p className="text-lg text-2xl mt-4">
                Join us in a grand celebration of culture, creativity, and
                excellence!
            </p>
        </section>
    );
};

export default Home;
