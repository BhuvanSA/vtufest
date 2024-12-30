"use client";

import { ToastProvider } from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface FormData {
    name: string;
    usn: string;
    teamManager: boolean;
    events: { eventNo: number; eventName: string; type: string }[];
    photo: File | null;
    phone: string;
    aadhar: File | null;
    sslc: File | null;
    puc: File | null;
    admission1: File | null;
    admission2: File | null;
    idcard: File | null;
}

const Register = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        usn: "",
        teamManager: false,
        events: [],
        photo: null,
        phone: "",
        aadhar: null,
        sslc: null,
        puc: null,
        admission1: null,
        admission2: null,
        idcard: null,
    });

    const [eventCategories, setEventCategories] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState<
        { eventNo: number; eventName: string; type: string }[]
    >([]);
    const [responseToast, SetresponseToast] = useState("");

    const router = useRouter();
    useEffect(() => {
        async function getEvents() {
            const res = await fetch("/api/getalleventregister", {
                method: "GET",
            });

            let { userEvents } = await res.json();
            console.log(userEvents);
            if (!formData.teamManager) {
                console.log("filtering");
                userEvents = userEvents.filter(
                    (x: {
                        registeredParticipant: number;
                        maxParticipant: number;
                        registeredAccompanist: number;
                        maxAccompanist: number;
                    }) =>
                        x.registeredParticipant < x.maxParticipant ||
                        x.registeredAccompanist < x.maxAccompanist
                );
                setEventCategories(userEvents);
            } else {
                setEventCategories([]);
            }
        }
        getEvents();
    }, [formData.teamManager]);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // Name validation
        if (!formData.name) newErrors.name = "Name is required.";

        // USN validation
        if (!formData.usn) newErrors.usn = "USN is required.";

        // Team Manager validation
        if (formData.teamManager === null)
            newErrors.teamManager = "Team manager selection is required.";

        // Events validation for non-Team Managers
        if (!formData.teamManager && formData.events.length === 0)
            newErrors.events = "Select at least one event.";

        // Phone validation
        if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Valid 10-digit phone number is required.";
        }

        // File validations
        if (!formData.photo) newErrors.photo = "Photo is required.";
        if (formData.teamManager && !formData.idcard)
            newErrors.idcard = "ID card is required for team managers.";
        if (!formData.teamManager) {
            if (!formData.aadhar) newErrors.aadhar = "Aadhar is required.";
            if (!formData.sslc) newErrors.sslc = "SSLC is required.";
            if (!formData.puc) newErrors.puc = "PUC is required.";
            if (!formData.admission1)
                newErrors.admission1 = "Admission1 is required.";
            if (!formData.admission2)
                newErrors.admission2 = "Admission2 is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const updatedValue =
            name === "teamManager" ? (value === "true" ? true : false) : value;

        setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
            const maxSizeInKB = 150;

            if (!allowedTypes.includes(file.type)) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: "Only JPEG, PNG, or PDF files are allowed.",
                }));
            } else if (file.size > maxSizeInKB * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: `File size must be less than ${maxSizeInKB} KB.`,
                }));
            } else {
                setErrors((prev) => ({ ...prev, [name]: "" }));
                setFormData((prev) => ({ ...prev, [name]: file }));
            }
        }
    };

    const handleEventSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const [eventNo, eventName] = value.split("|");

        const eventNoNumber = parseInt(eventNo, 10);

        const updatedSelectedEvents = checked
            ? [
                  ...selectedEvents,
                  { eventNo: eventNoNumber, eventName, type: "" },
              ]
            : selectedEvents.filter((event) => event.eventNo !== eventNoNumber);

        setSelectedEvents(updatedSelectedEvents);

        setFormData((prevFormData) => ({
            ...prevFormData,
            events: updatedSelectedEvents,
        }));
    };

    const handleRoleChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        eventNo: number
    ) => {
        const type = e.target.value;

        setSelectedEvents((prevSelectedEvents) => {
            const updatedSelectedEvents = prevSelectedEvents.map((event) =>
                event.eventNo === eventNo ? { ...event, type } : event
            );

            setFormData((prevFormData) => ({
                ...prevFormData,
                events: updatedSelectedEvents,
            }));

            return updatedSelectedEvents;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("hit");
        if (selectedEvents.length == 0) {
            alert("aleast one event must be selected");
        }
        if (validate()) {
            const formDataToSend = new FormData();
            console.log("validated hit");
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "events") {
                    formDataToSend.append(key, JSON.stringify(value));
                } else {
                    formDataToSend.append(key, value as Blob | string);
                }
            });

            console.log(formDataToSend.get("events"));
            try {
                const response = await fetch("/api/register", {
                    method: "POST",
                    body: formDataToSend,
                });
                const data = await response.json();

                if (data.success) {
                    SetresponseToast(data.message);
                    alert(data.message);
                    router.push("/register/getallregister");
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    alert(data.message);
                    SetresponseToast(data.message);
                }
            } catch (err) {
                alert("Failed to register. Please try again later.");
                SetresponseToast("Failed to register. Please try again later.");
                console.error(err);
            }
        }
    };

    const groupEventsByCategory = (events: any[]) => {
        return events.reduce(
            (
                acc: { [x: string]: any[] },
                event: { category: string | number }
            ) => {
                if (!acc[event.category]) {
                    acc[event.category] = [];
                }
                acc[event.category].push(event);
                return acc;
            },
            {}
        );
    };

    const groupedEvents = groupEventsByCategory(eventCategories);

    return (
        <ToastProvider>
            <section
                id="register"
                className="min-h-screen py-16 px-4 bg-gray-200 flex justify-center items-center"
            >
                <div className="w-full max-w-4xl p-6 bg-white text-white shadow-lg rounded-md">
                    <h2 className="text-2xl font-bold mb-6 text-yellow-800 font-Barrio text-center">
                        Registrant Page
                    </h2>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Name and USN */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-yellow-600 mb-2">
                                    Name
                                    <sup className="text-red-600 font-extrabold text-">
                                        *
                                    </sup>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 border ${
                                        errors.name
                                            ? "border-red-500"
                                            : "border-[#333333]"
                                    } rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-yellow-600 mb-2">
                                    USN
                                    <sup className="text-red-600 font-extrabold text-">
                                        *
                                    </sup>
                                </label>
                                <input
                                    type="text"
                                    name="usn"
                                    placeholder="Enter your USN"
                                    value={formData.usn}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 border ${
                                        errors.usn
                                            ? "border-red-500"
                                            : "border-[#333333]"
                                    } rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500`}
                                />
                                {errors.usn && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.usn}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Type */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-yellow-600 mb-2">
                                    Phone
                                    <sup className="text-red-600 font-extrabold text-">
                                        *
                                    </sup>
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter your Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 border ${
                                        errors?.phone
                                            ? "border-red-500"
                                            : "border-[#333333]"
                                    } rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500`}
                                />
                                {errors?.phone && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors?.phone}
                                    </p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-yellow-600 mb-2">
                                    Are you registering as Team Manager?
                                    <sup className="text-red-600 font-extrabold text-">
                                        *
                                    </sup>
                                </label>
                                <div className="flex items-center">
                                    <label className="mr-4 text-black">
                                        <input
                                            type="radio"
                                            name="teamManager"
                                            value="true"
                                            checked={
                                                formData.teamManager === true
                                            }
                                            onChange={handleChange}
                                            required
                                            className="mr-2"
                                        />
                                        Yes
                                    </label>
                                    <label className="mr-4 text-black">
                                        <input
                                            type="radio"
                                            name="teamManager"
                                            value="false"
                                            checked={
                                                formData.teamManager === false
                                            }
                                            onChange={handleChange}
                                            required
                                            className="mr-2"
                                        />
                                        No
                                    </label>
                                </div>
                                {errors.teamManager && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.teamManager}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Events */}
                        {!formData.teamManager && (
                            <>
                                <center>
                                    <h1 className="block text-2xl text-yellow-600 mb-4">
                                        Events
                                    </h1>
                                </center>
                                <div className="mb-6">
                                    {Object.entries(groupedEvents).map(
                                        ([category, events]) => (
                                            <div key={category}>
                                                <h2 className="text-xl font-semibold text-yellow-600 mb-2">
                                                    {category}
                                                </h2>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {events.map(
                                                        (
                                                            event: {
                                                                eventNo: number;
                                                                eventName: string;
                                                                registeredParticipant: number;
                                                                maxParticipant: number;
                                                                registeredAccompanist: number;
                                                                maxAccompanist: number;
                                                            },
                                                            index: number
                                                        ) => (
                                                            <fieldset
                                                                key={index}
                                                                className="mb-4 border-2 border-black p-2 rounded-lg hover:scale-105 transform transition-all"
                                                            >
                                                                <div className="flex items-center mb-1 hover:bg-gray-200 p-1 rounded-md transition-all">
                                                                    <input
                                                                        type="checkbox"
                                                                        name="events"
                                                                        value={`${event.eventNo}|${event.eventName}`}
                                                                        onChange={
                                                                            handleEventSelection
                                                                        }
                                                                        className="mr-2 accent-yellow-400"
                                                                    />
                                                                    <label className="text-sm text-black">
                                                                        {
                                                                            event.eventName
                                                                        }
                                                                    </label>
                                                                </div>

                                                                {selectedEvents
                                                                    .filter(
                                                                        (e) =>
                                                                            e.eventNo ===
                                                                            event.eventNo
                                                                    )
                                                                    .map(
                                                                        (
                                                                            selectedEvent
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    selectedEvent.eventNo
                                                                                }
                                                                                className="mt-2"
                                                                            >
                                                                                <label className="text-sm text-black">
                                                                                    Select
                                                                                    Type
                                                                                </label>
                                                                                <select
                                                                                    value={
                                                                                        selectedEvent.type
                                                                                    }
                                                                                    onChange={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleRoleChange(
                                                                                            e,
                                                                                            selectedEvent.eventNo
                                                                                        )
                                                                                    }
                                                                                    required
                                                                                    className="w-full px-4 py-2 border rounded-lg text-sm bg-white-600 text-black focus:outline-none focus:border-yellow-500"
                                                                                >
                                                                                    <option value="">
                                                                                        Select
                                                                                        type
                                                                                    </option>

                                                                                    {event.registeredParticipant <
                                                                                        event.maxParticipant && (
                                                                                        <option value="PARTICIPANT">
                                                                                            Participant
                                                                                        </option>
                                                                                    )}

                                                                                    {event.registeredAccompanist <
                                                                                        event.maxAccompanist && (
                                                                                        <option value="ACCOMPANIST">
                                                                                            Accompanist
                                                                                        </option>
                                                                                    )}
                                                                                </select>
                                                                            </div>
                                                                        )
                                                                    )}
                                                            </fieldset>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        )}

                        {/* File Uploads */}
                        <fieldset className="border-2 mb-5 border-black p-4 rounded-lg hover:scale-105 transform transition-all">
                            <legend className="font-semibold text-yellow-600">
                                File Uploads
                            </legend>
                            <div className="space-y-4">
                                {formData.teamManager ? (
                                    <>
                                        <div>
                                            <label
                                                className="block text-sm font-small text-yellow-600 mb-1"
                                                htmlFor="photo"
                                            >
                                                PHOTO:
                                                <sup className="text-red-600 font-extrabold text-">
                                                    *
                                                </sup>
                                            </label>
                                            <input
                                                type="file"
                                                id="photo"
                                                name="photo"
                                                onChange={handleFileChange}
                                                required
                                                className="w-full text-sm text-black bg-white-600 p-0 rounded-lg focus:outline-white hover:bg-gray-200"
                                            />
                                            {errors.photo && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.photo}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                className="block text-sm font-small text-yellow-600 mb-1"
                                                htmlFor="idcard"
                                            >
                                                IDCARD:
                                                <sup className="text-red-600 font-extrabold text-">
                                                    *
                                                </sup>
                                            </label>
                                            <input
                                                type="file"
                                                id="idcard"
                                                name="idcard"
                                                onChange={handleFileChange}
                                                required
                                                className="w-full text-sm text-black bg-white-600 p-0 rounded-lg focus:outline-white hover:bg-gray-200"
                                            />
                                            {errors.idcard && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.idcard}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    [
                                        "photo",
                                        "aadhar",
                                        "sslc",
                                        "puc",
                                        "idcard",
                                        "admission1",
                                        "admission2",
                                    ].map((fileField) => (
                                        <div key={fileField}>
                                            <label
                                                className="block text-sm font-small text-yellow-600 mb-1"
                                                htmlFor={fileField}
                                            >
                                                {fileField.toUpperCase()}:
                                                <sup className="text-red-600 font-extrabold text-">
                                                    *
                                                </sup>
                                            </label>
                                            <input
                                                type="file"
                                                id={fileField}
                                                name={fileField}
                                                onChange={handleFileChange}
                                                required
                                                className="w-full text-sm text-black bg-white-600 p-0 rounded-lg focus:outline-white hover:bg-gray-200"
                                            />
                                            {errors[fileField] && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors[fileField]}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </fieldset>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </section>
        </ToastProvider>
    );
};

export default Register;
