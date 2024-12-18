"use client";
import axios from "axios";
import React, { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

import { eventCategories } from "@/data/eventCategories";

export default function EventRegister() {
    const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
    const [responseBody, setResponseBody] = useState<object | null>(null);

    // Group events by category
    const groupedEvents = eventCategories.reduce((acc, event) => {
        acc[event.category] = acc[event.category] || [];
        acc[event.category].push(event);
        return acc;
    }, {} as Record<string, typeof eventCategories>);

    const toggleSelection = (eventNo: number) => {
        setSelectedEvents((prev) =>
            prev.includes(eventNo)
                ? prev.filter((id) => id !== eventNo)
                : [...prev, eventNo]
        );
    };

    const generateResponse = async () => {
        try {
            // Format the body to include only the required fields in the correct structure
            const body = JSON.stringify({
                events: eventCategories
                    .filter((event) => selectedEvents.includes(event.eventNo))
                    .map((event) => ({
                        eventNo: event.eventNo,
                        eventName: event.eventName,
                        category: event.category,
                        maxParticipant: event.maxParticipant,
                        maxAccompanist: event.maxAccompanist,
                    })),
            });
            let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "http://localhost:3000/api/eventsregister",
                data: { events: body },
            };

            const response = await axios.request(config);
            // Handle success response
            if (response.status === 200 || response.status === 201) {
                console.log("Response successfully sent:", response.data);
                alert("Response sent successfully!");
            } else {
                console.error("Unexpected response status:", response.status);
                alert("Something went wrong! Please try again.");
            }
        } catch (error) {
            // Handle error
            console.error("Error while sending response:", error);
            alert(
                "Failed to send response. Please check your connection or server."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="h-20"></div>
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
                    Select Your Events
                </h1>
                {/* Render sections by category using Accordion */}
                <Accordion type="single" collapsible className="w-full">
                    {Object.keys(groupedEvents).map((category) => {
                        // Calculate the number of selected events in this category
                        const selectedCount = groupedEvents[category].filter(
                            (event) => selectedEvents.includes(event.eventNo)
                        ).length;

                        return (
                            <AccordionItem key={category} value={category}>
                                <AccordionTrigger className="flex justify-between items-center w-full pr-4">
                                    <div className="flex-1">
                                        <span className="text-lg font-medium">
                                            {category}
                                        </span>
                                    </div>
                                    <div className="flex items-center ml-auto">
                                        {selectedCount > 0 && (
                                            <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                                                {selectedCount}
                                            </span>
                                        )}
                                        {/* <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" /> */}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {groupedEvents[category].map(
                                            (event) => (
                                                <div
                                                    key={event.eventNo}
                                                    onClick={() =>
                                                        toggleSelection(
                                                            event.eventNo
                                                        )
                                                    }
                                                    className={`p-5 border-2 rounded-lg shadow-md cursor-pointer transition duration-300 ${
                                                        selectedEvents.includes(
                                                            event.eventNo
                                                        )
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-300 bg-white hover:shadow-lg"
                                                    }`}
                                                >
                                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                                        {event.eventName}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        Max Participants:{" "}
                                                        <span className="font-medium text-gray-800">
                                                            {
                                                                event.maxParticipant
                                                            }
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Max Accompanists:{" "}
                                                        <span className="font-medium text-gray-800">
                                                            {
                                                                event.maxAccompanist
                                                            }
                                                        </span>
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>

                {/* Selected Events and Response Section */}
                <div className="mt-10 text-center">
                    <h2 className="text-2xl font-semibold text-gray-700">
                        Selected Events
                    </h2>
                    <ul className="mt-4">
                        {selectedEvents.length > 0 ? (
                            eventCategories
                                .filter((event) =>
                                    selectedEvents.includes(event.eventNo)
                                )
                                .map((event) => (
                                    <li
                                        key={event.eventNo}
                                        className="text-lg text-gray-800"
                                    >
                                        {event.eventName}
                                    </li>
                                ))
                        ) : (
                            <p className="text-gray-500">No events selected</p>
                        )}
                    </ul>
                    <button
                        onClick={generateResponse}
                        className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-500 transition"
                    >
                        Generate Response
                    </button>
                    {responseBody && (
                        <div className="mt-6 p-4 bg-gray-100 border rounded-md">
                            <pre className="text-sm text-gray-700">
                                {JSON.stringify(responseBody, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
