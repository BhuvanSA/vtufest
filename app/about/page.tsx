import React from "react";

const Page = () => {
    return (
        <div className="p-10">
            {/* Adds padding around the entire content */}
            <div className="h-20"></div>
            <h1 className="text-center text-5xl font-bold mb-10 tracking-wide">
                About the Fest
            </h1>
            <p className="text-center text-3xl leading-relaxed tracking-wider">
                The 24th VTU Youth Fest hosted by GAT marks our 25th
                Anniversary. Join us to celebrate culture, creativity, and
                sustainability in this unique Silver Jubilee event.
            </p>
        </div>
    );
};

export default Page;
