import React from "react";

const page = () => {
    return (
        <div className="p-10">
            <div className="h-20"></div>{" "}
            {/* Adds padding around the entire content */}
            <h1 className="text-center text-5xl font-bold mb-10 tracking-wide">
                Event Schedule
            </h1>
            <p className="text-center text-3xl leading-relaxed tracking-wider">
                The detailed schedule will be released soon. Mark your calendars
                for an unforgettable experience!
            </p>
        </div>
    );
};

export default page;
