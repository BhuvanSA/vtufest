"use client"; // Enable client-side data fetching

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

export default function EventsPage() {
    interface Event {
        id: number;
        eventName: string;
    }

    const [events, setEvents] = useState<Event[]>([]);
  
    // Fetch events from backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("/api/getalleventregister"); // Replace with your backend API URL
                const data = await response.json();
                console.log(data.userEvents);
                setEvents(data.userEvents);
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } 
        };

        fetchEvents();
    }, []);


    return (
        <div className="min-h-screen mt-10 flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
            <Card className="w-1/3 flex  flex-col  bg-card text-card-foreground">
                <CardHeader className="text-2xl text-yellow-500 text-center font-semibold hover:scale-105 transition-all">
                    Total No of Events : {events.length} events
                </CardHeader>
                <CardContent className="min-h-[500px] ">
                    <ul className="">
                        {events.map((event, index) => (
                            <li key={event.id} className="py-2 font-medium hover:scale-105 transition-all">
                                {index}. {event.eventName}
                            </li>
                        ))}
                    </ul>
                </CardContent>
                <CardFooter className="w-full">
                    <Button className="w-full">Pay {events.length > 10 ? 8000 : 4000} INR</Button>
                </CardFooter>
            </Card>

        </div>
    );
}

{/* <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">
                Event List <pre></pre>
                <small>Total Events : {events.length} </small>
            </h1>
            {/* <ul className="divide-y divide-gray-300">
                {events.map((event, index) => (
                    <li key={event.id} className="py-2">
                        <span className="font-medium">{index + 1}. </span>
                        {event.eventName}
                    </li>
                ))}
            </ul>
            <div className="mt-4 text-center font-semibold">
                <button className="bg-yellow-400 w-full p-2 rounded-sm  hover:scale-105 transition-all text-white font-semibold">
                    Pay ₹ {events.length > 10 ? 8000 : 4000}
                </button>
            </div> */}
// </div> */}