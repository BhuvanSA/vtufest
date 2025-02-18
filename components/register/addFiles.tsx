"use client";

import React, { useState, useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectLabel,
    SelectItem,
} from "@/components/ui/select";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { LoadingButton } from "../LoadingButton";
import { UploadDropzone } from "@/utils/uploadthing";
import { ArrowLeft, Save, VerifiedIcon } from "lucide-react";
import { Event } from "@/app/register/addRegistrant/page";
import {
    participantFormSchema,
    managerFormSchema,
} from "@/lib/schemas/register";
import Link from "next/link";
import Image from "next/image";

// Required Documents
const REQUIRED_DOCUMENTS = [
    { id: "photo", label: "Photo", hint: "Passport size photo of the student" },
    {
        id: "idCard",
        label: "College ID Card",
        hint: "College Identification Card of the student",
    },
    {
        id: "aadhar",
        label: "Aadhar Card",
        hint: "Please ensure to upload in a way 12-digit Aadhaar Number must be clearly visible",
    },
    {
        id: "sslc",
        label: "SSLC Marks Card",
        hint: "SSLC/10th or any equivalent marks card",
    },
    // {
    //     id: "puc",
    //     label: "PUC Marks Card",
    //     hint: "2nd PUC/ 12th Diploma or any equivalent marks card",
    // },
    // {
    //     id: "admission1",
    //     label: "Fee Receipt",
    //     hint: "First Semester Fee Receipt taken during Admission",
    // },
    // {
    //     id: "admission2",
    //     label: "Fee Reciept 2",
    //     hint: "Current Semester/Previous Semester Fee Receipt ",
    // },
];

type SelectRolesAndEventsProps = {
    allEvents: Event[];
};

export default function SelectRolesAndEvents({
    allEvents,
}: SelectRolesAndEventsProps) {
    const router = useRouter();
    const [selectedEvents, setSelectedEvents] = useState<
        { eventNo: number; type: "PARTICIPANT" | "ACCOMPANIST" }[]
    >([]);
    const [documentUrls, setDocumentUrls] = useState<Record<string, string>>(
        {}
    );
    // Add this below the existing documentUrls state
    const [managerDocumentUrls, setManagerDocumentUrls] = useState<
        Record<string, string>
    >({});

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue, // Destructure setValue
    } = useForm<z.infer<typeof participantFormSchema>>({
        resolver: zodResolver(participantFormSchema),
        defaultValues: {
            name: "",
            usn: "",
            phone: "",
            events: [],
            email: "",
            documents: {
                photo: "",
                idCard: "",
                aadhar: "",
                sslc: "",
                // puc: "",
                // admission1: "",
                // admission2: "",
            },
            gender: "",
            accomodation: false,
            blood: ""
        },
    });

    const {
        register: registerManager,
        handleSubmit: handleSubmitManager,
        formState: { errors: errorsManager },
        setValue: setValueManager,
        watch: watchManager,
    } = useForm<z.infer<typeof managerFormSchema>>({
        resolver: zodResolver(managerFormSchema),
        defaultValues: {
            name: "",
            usn: "",
            email: "",
            teamManager: true,
            phone: "",
            documents: {
                photo: "",
                idCard: "",
            },
            gender: "",
            accomodation: false,
            blood: "",
            designation: "",
        },
    });
    const [isOther, setIsOther] = useState(false);

    // Watch the current value of designation
    const selectedDesignation = watchManager("designation");
    const handleDesignationChange = (value: string) => {
        if (value === "others") {
            setIsOther(true);
            // Clear the field to let the user type a custom value
            setValueManager("designation", "");
        } else {
            setIsOther(false);
            setValueManager("designation", value);
        }
    };

    const [collegeRegion, setCollegeRegion] = useState<string>("");
    const [disbaled, setDisabled] = useState<boolean>(false);

    useEffect(() => {

        async function regionFetch() {
            const response = await fetch('/api/getonlycollegeregion');
            const regionCode = await response.json();
            const region = regionCode.region.region;
            console.log("Region:", region);
            setCollegeRegion(region)
        }
        regionFetch();
    }, [collegeRegion])

    // Synchronize selectedEvents with form
    useEffect(() => {
        setValue("events", selectedEvents);
        console.log("Selected Events:", selectedEvents);
    }, [selectedEvents, setValue]);

    // Synchronize documentUrls with form
    useEffect(() => {
        REQUIRED_DOCUMENTS.forEach((doc) => {
            setValue(
                `documents.${doc.id}` as const,
                documentUrls[doc.id] || ""
            );
        });

    }, [documentUrls, setValue]);

    // Add this useEffect alongside the existing one
    useEffect(() => {
        REQUIRED_DOCUMENTS.forEach((doc) => {
            if (doc.id === "photo" || doc.id === "idCard") {
                setValueManager(
                    `documents.${doc.id}` as const,
                    managerDocumentUrls[doc.id] || ""
                );
            }
        });
    }, [managerDocumentUrls, setValueManager]);
    // Existing useEffect for Participant & Accompanist
    // useEffect(() => {
    //     REQUIRED_DOCUMENTS.forEach((doc) => {
    //         setValue(
    //             `documents.${doc.id}` as const,
    //             documentUrls[doc.id] || ""
    //         );
    //     });
    // }, [documentUrls, setValue]);
    // Toggle event selection on card click
    const onToggleSelect = (eventNo: number, eventName: string) => {
        setSelectedEvents((prev) => {
            const idx = prev.findIndex((item) => item.eventNo === eventNo);
            if (idx >= 0) {
                // Remove it if clicked again
                return prev.filter((item) => item.eventNo !== eventNo);
            } else {
                // Add with default type "PARTICIPANT"
                return [...prev, { eventName, eventNo, type: "PARTICIPANT" }];
            }
        });
    };

    // Handle role changes in the Select component
    const onChangeRole = (
        eventNo: number,
        newType: "PARTICIPANT" | "ACCOMPANIST"
    ) => {
        setSelectedEvents((prev) => {
            return prev.map((item) =>
                item.eventNo === eventNo ? { ...item, type: newType } : item
            );
        });
    };

    // Form Submission Handler
    const onParticipantSubmit = async (
        data: z.infer<typeof participantFormSchema>
    ) => {
        const payload = {
            ...data,
            // events and documents are already included via useEffect
        };
        setDisabled(true);
        console.log("Submitting:", payload);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to register");
            }
            toast.success("Registered Successfully.");
            router.push("/register/getallregister");
        } catch (error: unknown) {
            if (error instanceof Error) {

                toast.error(error.message || "An error occurred.");
            }
        }
        finally {
            setDisabled(false);
        }
    };

    // Form Error Handler
    const onParticipantError = (
        err: FieldErrors<z.infer<typeof participantFormSchema>>
    ) => {
        console.log("Validation Error:", err);
        toast.error("Please fix the validation errors and try again.");
    };

    // File Delete Handler
    async function handleDeleteFromUploadThing(fileId: string) {
        try {
            await fetch("/api/deleteFiles", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ files: [fileId] }),
            });
            setDocumentUrls((prev) => ({ ...prev, [fileId]: "" }));
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }
    // Update or create a separate delete handler for Team Manager
    async function handleDeleteManagerDocument(fileId: string) {
        try {
            await fetch("/api/deleteFiles", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ files: [fileId] }),
            });
            setManagerDocumentUrls((prev) => ({ ...prev, [fileId]: "" }));
        } catch (error) {
            console.error("Error deleting manager file:", error);
        }
    }

    // Group Events by Category
    const groupedEvents = allEvents.reduce((acc, ev) => {
        acc[ev.category] = acc[ev.category] || [];
        acc[ev.category].push(ev);
        return acc;
    }, {} as Record<string, Event[]>);

    const onManagerError = (
        err: FieldErrors<z.infer<typeof managerFormSchema>>
    ) => {
        console.log("Manager Validation Error:", err);
        toast.error("Please fix the validation errors and try again.");
    };

    const onManagerSubmit = async (data: z.infer<typeof managerFormSchema>) => {
        const payload = {
            ...data,
            teamManager: true, // Ensure teamManager flag is set
            events: [], // No events for manager
        };
        setDisabled(true);
        console.log("Submitting Manager:", payload);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Failed to register");
            }
            toast.success("Manager Registered Successfully.");
            // Optionally redirect or reset the form
            router.push("/register/getallregister");
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error registering manager:", error.message);
                toast.error(error.message || "An error occurred.");
            }
        }
        finally {
            setDisabled(false);
        }
    };

    return (
        <Tabs defaultValue="participant" className="w-full px-10 ">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="participant"  >
                    Participant & Accompanist
                </TabsTrigger>
                <TabsTrigger value="manager">Team Manager</TabsTrigger>
            </TabsList>

            <TabsContent value="participant">
                <Card className="shadow-xl">
                    <form
                        onSubmit={handleSubmit(
                            onParticipantSubmit,
                            onParticipantError
                        )}
                    >
                        <CardHeader>
                            <CardTitle className="text-center text-[#D32F23] font-bold">
                                Register (Participant/Accompanist)
                            </CardTitle>
                            <CardDescription className="text-center text-[#F4D03F] font-bold">
                                Add details for Participant or Accompanist
                                roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Basic Information Fields */}
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                                    <div className="w-full md:w-1/3 space-y-1.5">
                                        <Label htmlFor="name">
                                            Name of the student (As mentioned on
                                            10th or any equivalent marks card) <small className="text-red-600">*</small>
                                        </Label>
                                        <Input
                                            {...register("name")}
                                            id="name"
                                            placeholder="Full Name - will be printed in your certificate"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                                        <Label htmlFor="username" >
                                            USN of the Student <small className="text-red-600">*</small>
                                        </Label>
                                        <Input
                                            {...register("usn")}
                                            id="usn"
                                            placeholder="University Seat Number"
                                        />
                                        {errors.usn && (
                                            <p className="text-red-500 text-sm">
                                                {errors.usn.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                                        <Label htmlFor="phone">
                                            Phone number of the student <small className="text-red-600">*</small>
                                        </Label>
                                        <Input
                                            id="phoneno"
                                            placeholder="Phone Number"
                                            {...register("phone")}
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm">
                                                {errors.phone.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 md:gap-10 w-full">
                                    <div className="w-1/3 md:w-1/3 space-y-1.5 mt-6 w-full">
                                        <Label htmlFor="gender">
                                            Gender of the student <small className="text-red-600">*</small>
                                        </Label>
                                        <Select
                                            {...register("gender")}
                                            onValueChange={(value) =>
                                                setValue("gender", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Gender
                                                    </SelectLabel>
                                                    <SelectItem value="male">
                                                        Male
                                                    </SelectItem>
                                                    <SelectItem value="female">
                                                        Female
                                                    </SelectItem>
                                                    <SelectItem value="other">
                                                        Other
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && (
                                            <p className="text-red-500 text-sm">
                                                {errors.gender.message}
                                            </p>
                                        )}
                                    </div>

                                    {collegeRegion && ['Belgavi Region (2)', 'Kalaburgi Region (3)', 'Mysuru Region (4)'].includes(collegeRegion) ?
                                        <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                                            <Label htmlFor="accommodation">Need Accommodation <small className="text-red-600">*</small></Label>
                                            <Select
                                                {...register("accomodation")}
                                                onValueChange={(value) => setValue("accomodation", value === "yes")}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Accommodation" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Accommodation</SelectLabel>
                                                        <SelectItem value="yes">Yes</SelectItem>
                                                        <SelectItem value="no">No</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.accomodation && (
                                                <p className="text-red-500 text-sm">{errors.accomodation.message}</p>
                                            )}
                                        </div > : <></>
                                    }

                                    <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                                        <Label htmlFor="blood">Date of Birth <small className="text-red-600">*</small></Label>
                                        <Input
                                            type="date"
                                            {...register("blood")}
                                            id="blood"
                                            name="blood"
                                            className="w-full"
                                            placeholder="Enter the date of birth"
                                        />
                                        {errors.blood && (
                                            <p className="text-red-500 text-sm">
                                                {errors.blood.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                                        <Label htmlFor="email">Email <small className="text-red-600">*</small></Label>
                                        <Input
                                            {...register("email")}
                                            id="email"
                                            name="email"
                                            placeholder="Enter the email "
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Event Selection */}
                            <div className="bg-card text-card-foreground p-4 rounded-md">
                                <h2
                                    className="text-2xl font-semibold text-foreground mb-4"
                                    aria-label="Available events"
                                    tabIndex={0}
                                >
                                    Select the events that you are Participating
                                    / Accompanying in
                                </h2>

                                {allEvents.length === 0 ? (
                                    <p
                                        className="text-sm text-muted-foreground"
                                        role="status"
                                    >
                                        No available events.
                                    </p>
                                ) : (
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="w-full"
                                    >
                                        {Object.entries(groupedEvents).map(
                                            ([category, events]) => (
                                                <AccordionItem
                                                    key={category}
                                                    value={category}
                                                >
                                                    <AccordionTrigger>
                                                        {category}
                                                    </AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1.5">
                                                            {events.map(
                                                                (event) => {
                                                                    const selectedObj =
                                                                        selectedEvents.find(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.eventNo ===
                                                                                event.eventNo
                                                                        );
                                                                    const isSelected =
                                                                        !!selectedObj;
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                event.eventNo
                                                                            }
                                                                            role="button"
                                                                            tabIndex={
                                                                                0
                                                                            }
                                                                            aria-pressed={
                                                                                isSelected
                                                                            }
                                                                            onClick={() =>
                                                                                onToggleSelect(
                                                                                    event.eventNo,
                                                                                    event.eventName
                                                                                )
                                                                            }
                                                                            onKeyDown={(
                                                                                e
                                                                            ) => {
                                                                                if (
                                                                                    e.key ===
                                                                                    "Enter" ||
                                                                                    e.key ===
                                                                                    " "
                                                                                ) {
                                                                                    onToggleSelect(
                                                                                        event.eventNo,
                                                                                        event.eventName
                                                                                    );
                                                                                }
                                                                            }}
                                                                            className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 flex flex-col h-full ${isSelected
                                                                                ? "border-primary bg-primary/10"
                                                                                : "border-border bg-card"
                                                                                }`}
                                                                        >
                                                                            <h3 className="text-lg font-semibold mb-2">
                                                                                {
                                                                                    event.eventName
                                                                                }
                                                                            </h3>
                                                                            <div className="mt-auto flex items-end justify-between">
                                                                                <div>
                                                                                    <p className="text-sm">
                                                                                        Max
                                                                                        Participants:{" "}
                                                                                        {
                                                                                            event.maxParticipant
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-sm">
                                                                                        Max
                                                                                        Accompanists:{" "}
                                                                                        {
                                                                                            event.maxAccompanist
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                <div
                                                                                    onClick={(
                                                                                        e
                                                                                    ) => {
                                                                                        // Prevent card click from toggling selection
                                                                                        e.stopPropagation();
                                                                                    }}
                                                                                >
                                                                                    <Select
                                                                                        value={
                                                                                            selectedObj?.type ||
                                                                                            "PARTICIPANT"
                                                                                        }
                                                                                        onValueChange={(
                                                                                            val
                                                                                        ) =>
                                                                                            onChangeRole(
                                                                                                event.eventNo,
                                                                                                val as
                                                                                                | "PARTICIPANT"
                                                                                                | "ACCOMPANIST"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <SelectTrigger>
                                                                                            <SelectValue placeholder="Select a role" />
                                                                                        </SelectTrigger>
                                                                                        <SelectContent>
                                                                                            <SelectGroup>
                                                                                                <SelectLabel>
                                                                                                    As
                                                                                                </SelectLabel>
                                                                                                {event.registeredParticipant <
                                                                                                    event.maxParticipant && (
                                                                                                        <SelectItem value="PARTICIPANT">
                                                                                                            Participant
                                                                                                        </SelectItem>
                                                                                                    )}
                                                                                                {event.registeredAccompanist <
                                                                                                    event.maxAccompanist && (
                                                                                                        <SelectItem value="ACCOMPANIST">
                                                                                                            Accompanist
                                                                                                        </SelectItem>
                                                                                                    )}
                                                                                            </SelectGroup>
                                                                                        </SelectContent>
                                                                                    </Select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            )
                                        )}
                                    </Accordion>
                                )}
                                {errors.events && (
                                    <p className="text-red-500 text-sm">
                                        {errors.events.message}
                                    </p>
                                )}
                            </div>

                            {/* Documents Upload */}
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Upload Documents
                                </h2>
                                <p className="mb-4 text-muted-foreground text-red-500">
                                    <span className="font-semibold text-red-600">Note:</span> Students are required to submit valid documents for verification.
                                    All documents must be uploaded in<span className="text-red-600 font-bold"> PNG or JPG</span>  format, with a file size not
                                    exceeding <span className="font-bold text-red-600">256 KB</span>. If any document fails the verification process, participants
                                    will be notified and given an opportunity to reupload the corrected file.
                                    Failure to meet the specified format, size, or authenticity requirements
                                    after re-uploading may result in disqualification. Ensure all submissions
                                    are clear, legible, and comply with the guidelines provided.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {REQUIRED_DOCUMENTS.map((doc) => {
                                        const isUploaded =
                                            !!documentUrls[doc.id];
                                        return (
                                            <div
                                                key={doc.id}
                                                className={`space-y-1.5 border rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-2 ${isUploaded
                                                    ? "border-green-500 border-2"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                <Label htmlFor={doc.id}>
                                                    {doc.label} <span className="text-red-600 text-xs font-bold">* (PNG / JPG) </span>
                                                </Label>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {doc.hint}
                                                </p>
                                                {isUploaded ? (
                                                    <div className="w-full h-[244px] flex flex-col rounded-[var(--radius)] items-center justify-end p-12 space-y-2 bg-gradient-to-t from-green-50 to-transparent">
                                                        <p className="text-green-500 flex flex-col justify-items-center items-center gap-2 pb-10">

                                                            <p className="flex  gap-2 items-center flex-row">Upload Complete <VerifiedIcon /></p>

                                                            <Image
                                                                src={`https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${documentUrls[doc.id]}`}
                                                                width={60}
                                                                height={60}
                                                                alt="uplaoded image"
                                                            />
                                                        </p>
                                                        <LoadingButton
                                                            type="button"
                                                            onClick={async () => {
                                                                await handleDeleteFromUploadThing(
                                                                    doc.id
                                                                );
                                                            }}
                                                        >
                                                            Edit (Re-upload)
                                                        </LoadingButton>
                                                    </div>
                                                ) : (
                                                    <UploadDropzone
                                                        endpoint="imageUploader"
                                                        onClientUploadComplete={(
                                                            res
                                                        ) => {
                                                            if (res && res[0]) {
                                                                setDocumentUrls(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [doc.id]:
                                                                            res[0]
                                                                                .key,
                                                                    })
                                                                );
                                                                toast.success(
                                                                    `${doc.label} Upload Completed`
                                                                );
                                                            }
                                                        }}
                                                        onUploadError={(
                                                            error: Error
                                                        ) => {
                                                            toast.error(
                                                                `Error: ${error.message} Uploading ${doc.label}`
                                                            );
                                                        }}
                                                    />
                                                )}
                                                {errors.documents?.[
                                                    doc.id as keyof typeof errors.documents
                                                ] && (
                                                        <p className="text-red-500 text-sm">
                                                            {
                                                                errors.documents[
                                                                    doc.id as keyof typeof errors.documents
                                                                ]?.message
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center gap-5">
                            <Button className="px-8 text-xl" type="submit" disabled={disbaled}>
                                <Save className="w-5 h-5 mr-2" /> Save
                            </Button>

                            <Link href="/register/getallregister">
                                <Button variant="outline" className="border hover:border-primary px-8 text-xl">
                                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                                </Button>
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>

            <TabsContent value="manager">
                <Card>
                    <form
                        onSubmit={handleSubmitManager(
                            onManagerSubmit,
                            onManagerError
                        )}
                    >
                        <CardHeader>
                            <CardTitle className="text-center text-[#D32F23] font-bold">
                                Team Manager
                            </CardTitle>
                            <CardDescription className="text-center text-[#F4D03F] font-bold">
                                Add Details for the Team Manager role.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Basic Information Fields */}
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                    <div className="w-full md:w-1/3 space-y-1.5">
                                        <Label htmlFor="managerName">
                                            Name <small className="text-red-600">*</small>
                                        </Label>
                                        <Input
                                            {...registerManager("name")}
                                            id="managerName"
                                            placeholder="Full Name - will be printed in your certificate"
                                        />
                                        {errorsManager.name && (
                                            <p className="text-red-500 text-sm">
                                                {errorsManager.name.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/3 space-y-1.5">
                                        <Label htmlFor="managerUsn">ID card Number  <small className="text-red-600">*</small></Label>
                                        <Input
                                            {...registerManager("usn")}
                                            id="managerUsn"
                                            placeholder="ID Number"
                                        />
                                        {errorsManager.usn && (
                                            <p className="text-red-500 text-sm">
                                                {errorsManager.usn.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full md:w-1/3 space-y-1.5">
                                        <Label htmlFor="managerdesignation">
                                            Designation <small className="text-red-600">*</small>
                                        </Label>

                                        {/* Render either the Select dropdown or an Input based on isOther */}
                                        {!isOther ? (
                                            <Select onValueChange={handleDesignationChange}>
                                                <SelectTrigger id="managerdesignation">
                                                    <SelectValue placeholder="Select Designation" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Designation</SelectLabel>
                                                        <SelectItem value="Professor">Professor</SelectItem>
                                                        <SelectItem value="Associate Professor">
                                                            Associate Professor
                                                        </SelectItem>
                                                        <SelectItem value="Assistant Professor">
                                                            Assistant Professor
                                                        </SelectItem>
                                                        <SelectItem value="P.E.Director">
                                                            P.E.Director
                                                        </SelectItem>
                                                        <SelectItem value="others">Others</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <>
                                                <Input
                                                    id="managerdesignation"
                                                    // Notice that the input’s value is taken from the same field
                                                    value={selectedDesignation}
                                                    // Instead of using the register spread, we update the field directly.
                                                    onChange={(e) => setValueManager("designation", e.target.value)}
                                                    placeholder="Please specify your designation"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        // Optionally, clear the designation field before switching back.
                                                        setValueManager("designation", "");
                                                        setIsOther(false);
                                                    }}
                                                    className="text-sm text-blue-600 underline mt-1"
                                                >
                                                    Back to selection
                                                </button>
                                            </>
                                        )}

                                        {errorsManager.designation && (
                                            <p className="text-red-500 text-sm">
                                                {errorsManager.designation.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="w-full md:w-1/3 space-y-1.5">
                                        <Label htmlFor="managerPhone">
                                            Phone Number  <small className="text-red-600">*</small>
                                        </Label>
                                        <Input
                                            {...registerManager("phone")}
                                            id="managerPhone"
                                            placeholder="Phone Number"
                                        />
                                        {errorsManager.phone && (
                                            <p className="text-red-500 text-sm">
                                                {errorsManager.phone.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                                    <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                                        <Label htmlFor="managerGender">
                                            Gender <small className="text-red-600">*</small>
                                        </Label>
                                        <Select
                                            {...registerManager("gender")}
                                            onValueChange={(value) =>
                                                setValueManager("gender", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Gender
                                                    </SelectLabel>
                                                    <SelectItem value="male">
                                                        Male
                                                    </SelectItem>
                                                    <SelectItem value="female">
                                                        Female
                                                    </SelectItem>
                                                    <SelectItem value="other">
                                                        Other
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        {errorsManager.gender && (
                                            <p className="text-red-500 text-sm">
                                                {errorsManager.gender.message}
                                            </p>
                                        )}
                                    </div>
                                    {collegeRegion && ['Belgavi Region (2)', 'Kalaburgi Region (3)', 'Mysuru Region (4)'].includes(collegeRegion) ?
                                        <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                                            <Label htmlFor="Manageraccommodation">Need Accommodation  <small className="text-red-600">*</small></Label>
                                            <Select
                                                {...register("accomodation")}
                                                onValueChange={(value) => setValue("accomodation", value === "yes")}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Accommodation" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Accommodation</SelectLabel>
                                                        <SelectItem value="yes">Yes</SelectItem>
                                                        <SelectItem value="no">No</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {errors.accomodation && (
                                                <p className="text-red-500 text-sm">{errors.accomodation.message}</p>
                                            )}
                                        </div> : <></>
                                    }
                                    <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                                        <Label htmlFor="Managerblood">Date Of Birth  <small className="text-red-600">*</small></Label>
                                        <Input
                                            {...registerManager("blood")}
                                            id="Managerblood"
                                            name="blood"
                                            type="date"
                                        />
                                        {errors.blood && (
                                            <p className="text-red-500 text-sm">
                                                {errors.blood.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="w-full md:w-1/3 space-y-1.5 mt-6">
                                        <Label htmlFor="Manageremail">Email  <small className="text-red-600">*</small> </Label>
                                        <Input
                                            {...registerManager("email")}
                                            id="Manageremail"
                                            name="email"
                                            placeholder="Enter the email "
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-sm">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Documents Upload */}
                            <div className="mt-6">
                                <h2 className="text-2xl font-semibold mb-4">
                                    Upload Documents
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Only include photo and idCard */}
                                    {REQUIRED_DOCUMENTS.filter(
                                        (doc) =>
                                            doc.id === "photo" ||
                                            doc.id === "idCard"
                                    ).map((doc) => {
                                        const isUploaded =
                                            !!managerDocumentUrls[doc.id];
                                        return (
                                            <div
                                                key={doc.id}
                                                className={`space-y-1.5 border rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-2 ${isUploaded
                                                    ? "border-green-500 border-2"
                                                    : "border-gray-300"
                                                    }`}
                                            >
                                                <Label htmlFor={doc.id}>
                                                    {doc.label}  <span className="text-red-500 font-bold text-xs">* (PNG / JPG)</span>
                                                </Label>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {doc.hint.replace('student', 'Team Manager')}
                                                </p>
                                                {isUploaded ? (
                                                    <div className="w-full h-[244px] flex flex-col rounded-[var(--radius)] items-center justify-end p-12 space-y-2 bg-gradient-to-t from-green-50 to-transparent">
                                                        <div className="text-green-500 flex flex-col justify-items-center items-center gap-2 pb-10">

                                                            <p className="flex  gap-2 items-center flex-row">Upload Complete <VerifiedIcon /></p>

                                                            <Image
                                                                src={`https://${process.env.UPLOADTHING_APP_ID}.ufs.sh/f/${managerDocumentUrls[doc.id]}`}
                                                                width={60}
                                                                height={60}
                                                                alt="uplaoded image"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={async () => {
                                                                await handleDeleteManagerDocument(
                                                                    doc.id
                                                                );
                                                            }}
                                                        >
                                                            Edit (Re-upload)
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <UploadDropzone
                                                        endpoint="imageUploader"
                                                        onClientUploadComplete={(
                                                            res
                                                        ) => {
                                                            if (res && res[0]) {
                                                                setManagerDocumentUrls(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [doc.id]:
                                                                            res[0]
                                                                                .key,
                                                                    })
                                                                );
                                                                toast.success(
                                                                    `${doc.label} Upload Completed`
                                                                );
                                                            }
                                                        }}
                                                        onUploadError={(
                                                            error: Error
                                                        ) => {
                                                            toast.error(
                                                                `Error: ${error.message} Uploading ${doc.label}`
                                                            );
                                                        }}
                                                    />
                                                )}
                                                {errorsManager.documents?.[
                                                    doc.id as keyof typeof errorsManager.documents
                                                ] && (
                                                        <p className="text-red-500 text-sm">
                                                            {
                                                                errorsManager
                                                                    .documents[
                                                                    doc.id as keyof typeof errorsManager.documents
                                                                ]?.message
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="w-full text-center flex gap-3 justify-center">
                            <Button className="px-8 text-xl" type="submit" disabled={disbaled}>
                                <Save className="w-5 h-5 mr-2" /> Save
                            </Button>

                            <Link href="/register/getallregister">
                                <Button variant="outline" className="border hover:border-primary px-8 text-xl">
                                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                                </Button>
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
