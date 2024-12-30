"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { eventCategories } from "@/data/eventCategories";
import { useRouter } from "next/navigation";

export default function EventRegister() {
    const router = useRouter();
    const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
    const [responseBody, setResponseBody] = useState<object | null>(null);
    const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);

    const handleDelete = async (id: number) => {
        const response = await fetch("/api/deleteeventregister", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ eventId: id }),
        });
        // const data = await response.json();
        setRegisteredEvents((prev) => prev.filter((event) => event.id !== id));
    };

    useEffect(() => {
        async function fetchRegisteredEvents() {
            const res = await fetch("/api/getalleventregister", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            console.log(data);
            setRegisteredEvents(data.userEvents);
        }
        console.log("Fetching registered events");
        fetchRegisteredEvents();
    }, [selectedEvents]);
    const availableEvents = eventCategories.filter(
        (event) =>
            !registeredEvents?.some(
                (regEvent) => regEvent.eventNo === event.eventNo
            )
    );

    // Group events by category
    const groupedEvents = availableEvents.reduce((acc, event) => {
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
            const config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "http://localhost:3000/api/eventsregister",
                data: { events: body },
            };

            const response = await axios.request(config);
            if (response.status === 200 || response.status === 201) {
                console.log("Response successfully sent:", response.data);
                // alert("Response sent successfully!");
                router.push("/register/getallregister");
                setSelectedEvents([]);
            } else {
                console.error("Unexpected response status:", response.status);
                alert("Something went wrong! Please try again.");
            }
        } catch (error) {
            console.error("Error while sending response:", error);
            alert(
                "Failed to send response. Please check your connection or server."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row gap-8">
            {/* Event Selection Section */}
            <div className="lg:w-3/4 w-full border border-gray-300 p-6 rounded-lg shadow-sm bg-white">
                <h1 className="text-2xl sm:text-4xl font-bold text-center mb-6 text-gray-800">
                    Select Your Events
                </h1>
                <Accordion type="single" collapsible className="w-full">
                    {Object.keys(groupedEvents).map((category) => {
                        const selectedCount = groupedEvents[category].filter(
                            (event) => selectedEvents.includes(event.eventNo)
                        ).length;

                        const totalEvents = groupedEvents[category].length;

                        return (
                            <AccordionItem key={category} value={category}>
                                <AccordionTrigger className="flex justify-between items-center w-full pr-4">
                                    <div className="flex-1">
                                        <span className="text-lg font-semibold">
                                            {category} ({totalEvents}){" "}
                                            {/* Add total events count here */}
                                        </span>
                                    </div>
                                    <div className="flex items-center ml-auto">
                                        {selectedCount > 0 && (
                                            <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                                                {selectedCount}
                                            </span>
                                        )}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groupedEvents[category].map(
                                            (event) => (
                                                <div
                                                    key={event.eventNo}
                                                    onClick={() =>
                                                        toggleSelection(
                                                            event.eventNo
                                                        )
                                                    }
                                                    className={`p-4 border-2 rounded-lg shadow-md cursor-pointer transition duration-300 ${
                                                        selectedEvents.includes(
                                                            event.eventNo
                                                        )
                                                            ? "border-blue-500 bg-blue-50"
                                                            : "border-gray-300 bg-white hover:shadow-lg"
                                                    }`}
                                                >
                                                    <h3 className="text-md sm:text-lg font-semibold text-gray-700 mb-2">
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
            </div>

            {/* Selected Events Section */}
            <div className="lg:w-[38%] w-full">
                <div className="border border-gray-300 text-center p-6 rounded-lg shadow-sm bg-white flex flex-col gap-4">
                    <div className="flex items-center text justify-between p-3 rounded-md">
                        <h2 className="text-lg sm:text-xl  font-semibold ">
                            Already Registered Events
                        </h2>
                        {registeredEvents?.length > 0 && (
                            <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                {registeredEvents.length}
                            </span>
                        )}
                    </div>
                    <ul className=" flex flex-col gap-2 ">
                        {registeredEvents?.length > 0 ? (
                            registeredEvents.map((event, index) => (
                                <li
                                    key={event.eventNo}
                                    className="text-gray-800 font-medium flex items-start justify-between"
                                >
                                    <div className=" hover:bg-gray-200 ">
                                        <small className="font-semibold">
                                            {index + 1}.
                                        </small>
                                        <small className="font-semibold ">
                                            {event.eventName}
                                        </small>
                                    </div>
                                    <div>
                                        <small
                                            className="font-semibold text-lg hover:bg-slate-600"
                                            onClick={() =>
                                                handleDelete(event.id)
                                            }
                                        >
                                            {" "}
                                            &times;
                                        </small>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No events selected</p>
                        )}
                    </ul>
                </div>
                <div className="border border-gray-300 text-center p-6 rounded-lg shadow-sm bg-white flex flex-col gap-4">
                    <div className="flex items-center text justify-between p-3 rounded-md">
                        <h2 className="text-lg sm:text-xl  font-semibold ">
                            Selected Events
                        </h2>
                        {selectedEvents.length > 0 && (
                            <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                {selectedEvents.length}
                            </span>
                        )}
                    </div>
                    <ul className=" flex flex-col gap-2 ">
                        {selectedEvents.length > 0 ? (
                            eventCategories
                                .filter((event) =>
                                    selectedEvents.includes(event.eventNo)
                                )
                                .map((event, index) => (
                                    <li
                                        key={event.eventNo}
                                        className="text-gray-800 font-medium flex items-start  hover:bg-gray-200 "
                                    >
                                        <small className="font-semibold">
                                            {index + 1}.
                                        </small>
                                        <small className="font-semibold ">
                                            {event.eventName}
                                        </small>
                                    </li>
                                ))
                        ) : (
                            <p className="text-gray-500">No events selected</p>
                        )}
                    </ul>
                    <button
                        onClick={generateResponse}
                        className="px-4 py-3 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:scale-105 transition"
                    >
                        Submit
                    </button>
                    {responseBody && (
                        <div className="mt-4 p-4 bg-gray-50 border rounded-md">
                            <pre className="text-sm text-gray-700 overflow-x-auto">
                                {JSON.stringify(responseBody, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
