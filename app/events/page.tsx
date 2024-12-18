import React from "react";

const page = () => {
    return (
        <div className="p-10">
            {" "}
            <div className="h-20"></div>
            {/* Adds padding around the entire content */}
            <h1 className="text-center text-5xl font-bold mb-10 tracking-wide">
                Featured Events
            </h1>
            <p className="text-center text-3xl leading-relaxed tracking-wider">
                From cultural performances to technical showcases, this fest has
                something for everyone. Stay tuned for the event lineup!
            </p>
        </div>
    );
};

export default page;
