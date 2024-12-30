"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { eventCategories } from "@/data/eventCategories";

export default function EventRegister() {
    const router = useRouter();
    const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
    const [responseBody, setResponseBody] = useState<object | null>(null);
    const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<{
        id: number;
        name: string;
    } | null>(null);

    const handleDelete = async (id: number, name: string) => {
        setEventToDelete({ id, name });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        setIsLoading(true);
        try {
            const response = await fetch("/api/deleteeventregister", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventId: eventToDelete.id }),
            });
            const data = await response.json();
            setRegisteredEvents((prev) =>
                prev.filter((event) => event.id !== eventToDelete.id)
            );
            toast.success(data.message);
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event. Please try again.");
        } finally {
            setIsLoading(false);
            setDeleteDialogOpen(false);
            setEventToDelete(null);
        }
    };

    useEffect(() => {
        async function fetchRegisteredEvents() {
            setIsLoading(true);
            try {
                const res = await fetch("/api/getalleventregister", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                setRegisteredEvents(data.userEvents);
            } catch (error) {
                console.error("Error fetching registered events:", error);
                toast.error(
                    "Failed to fetch registered events. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        }
        fetchRegisteredEvents();
    }, [selectedEvents]);

    const availableEvents = eventCategories.filter(
        (event) =>
            !registeredEvents.some(
                (regEvent) => regEvent.eventNo === event.eventNo
            )
    );

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
        setIsLoading(true);
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
            let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "/api/eventsregister",
                data: { events: body },
            };

            const response = await axios.request(config);
            if (response.status === 200 || response.status === 201) {
                console.log("Response successfully sent:", response.data);
                toast.success("Response sent successfully!");
                setSelectedEvents([]);
            } else {
                console.error("Unexpected response status:", response.status);
                toast.error("Something went wrong! Please try again.");
            }
        } catch (error) {
            console.error("Error while sending response:", error);
            toast.error(
                "Failed to send response. Please check your connection or server."
            );
        } finally {
            setIsLoading(false);
            router.push("/register/getallregister");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center"
        >
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#4338ca",
                        color: "#ffffff",
                    },
                }}
            />
            <div className="w-full max-w-7xl">
                <h1 className="text-3xl font-bold mb-8 text-indigo-800 text-center">
                    Event Registration
                </h1>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Event Selection Section */}
                    <div className="lg:w-2/3 w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
                        <div className="p-6 space-y-6">
                            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
                                Select Your Events
                            </h2>
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                {Object.keys(groupedEvents).map((category) => {
                                    const selectedCount = groupedEvents[
                                        category
                                    ].filter((event) =>
                                        selectedEvents.includes(event.eventNo)
                                    ).length;
                                    const totalEvents =
                                        groupedEvents[category].length;

                                    return (
                                        <AccordionItem
                                            key={category}
                                            value={category}
                                        >
                                            <AccordionTrigger className="flex justify-between items-center w-full px-4 py-2 text-left text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-200">
                                                <span className="text-lg font-medium">
                                                    {category} ({totalEvents})
                                                </span>
                                                {selectedCount > 0 && (
                                                    <span className="bg-indigo-200 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                                        {selectedCount}
                                                    </span>
                                                )}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                                    {groupedEvents[
                                                        category
                                                    ].map((event) => (
                                                        <motion.div
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
                                                                    ? "border-indigo-500 bg-indigo-50"
                                                                    : "border-gray-300 bg-white hover:border-indigo-300"
                                                            }`}
                                                            whileHover={{
                                                                scale: 1.03,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.98,
                                                            }}
                                                        >
                                                            <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                                                                {
                                                                    event.eventName
                                                                }
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                Max
                                                                Participants:{" "}
                                                                <span className="font-medium text-indigo-600">
                                                                    {
                                                                        event.maxParticipant
                                                                    }
                                                                </span>
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Max
                                                                Accompanists:{" "}
                                                                <span className="font-medium text-indigo-600">
                                                                    {
                                                                        event.maxAccompanist
                                                                    }
                                                                </span>
                                                            </p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </div>
                    </div>

                    {/* Selected and Registered Events Section */}
                    <div className="lg:w-1/3 w-full space-y-6">
                        {/* Registered Events */}
                        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-indigo-800">
                                        Registered Events
                                    </h2>
                                    {registeredEvents.length > 0 && (
                                        <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                            {registeredEvents.length}
                                        </span>
                                    )}
                                </div>
                                <ul className="space-y-2">
                                    {registeredEvents.length > 0 ? (
                                        registeredEvents.map((event, index) => (
                                            <li
                                                key={event.eventNo}
                                                className="flex items-center justify-between p-2 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                                            >
                                                <span className="text-gray-800">
                                                    <span className="font-medium">
                                                        {index + 1}.{" "}
                                                    </span>
                                                    {event.eventName}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            event.id,
                                                            event.eventName
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                                    disabled={isLoading}
                                                >
                                                    &times;
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">
                                            No events registered
                                        </p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Selected Events */}
                        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-indigo-800">
                                        Selected Events
                                    </h2>
                                    {selectedEvents.length > 0 && (
                                        <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                            {selectedEvents.length}
                                        </span>
                                    )}
                                </div>
                                <ul className="space-y-2">
                                    {selectedEvents.length > 0 ? (
                                        eventCategories
                                            .filter((event) =>
                                                selectedEvents.includes(
                                                    event.eventNo
                                                )
                                            )
                                            .map((event, index) => (
                                                <li
                                                    key={event.eventNo}
                                                    className="p-2 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                                                >
                                                    <span className="text-gray-800">
                                                        <span className="font-medium">
                                                            {index + 1}.{" "}
                                                        </span>
                                                        {event.eventName}
                                                    </span>
                                                </li>
                                            ))
                                    ) : (
                                        <p className="text-gray-500">
                                            No events selected
                                        </p>
                                    )}
                                </ul>
                                <button
                                    onClick={generateResponse}
                                    disabled={
                                        selectedEvents.length === 0 || isLoading
                                    }
                                    className={`w-full px-6 py-3 text-white font-medium rounded-md shadow-sm transition-all duration-200 ${
                                        selectedEvents.length === 0 || isLoading
                                            ? "bg-indigo-300 cursor-not-allowed"
                                            : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    }`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Submitting...
                                        </div>
                                    ) : (
                                        "Submit"
                                    )}
                                </button>
                            </div>
                        </div>

                        {responseBody && (
                            <div className="mt-4 p-4 bg-white border border-indigo-200 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                                    Response:
                                </h3>
                                <pre className="text-sm text-gray-700 overflow-x-auto bg-indigo-50 p-2 rounded">
                                    {JSON.stringify(responseBody, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the event "
                            {eventToDelete?.name}"?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
