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
import { VerifiedIcon } from "lucide-react";
import { Event } from "@/app/register/addRegistrant/page";
import {
    participantFormSchema,
    managerFormSchema,
} from "@/lib/schemas/register";

// Required Documents
const REQUIRED_DOCUMENTS = [
    { id: "photo", label: "Photo", hint: "Upload passport size photo" },
    { id: "idCard", label: "College ID Card", hint: "Upload college ID card" },
    { id: "aadhar", label: "Aadhar Card", hint: "Upload Aadhar card" },
    { id: "sslc", label: "SSLC Marks Card", hint: "Upload SSLC marks card" },
    { id: "puc", label: "PUC Marks Card", hint: "Upload PUC marks card" },
    {
        id: "admission1",
        label: "Admission Document 1",
        hint: "Upload first admission document",
    },
    {
        id: "admission2",
        label: "Admission Document 2",
        hint: "Upload second admission document",
    },
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
            documents: {
                photo: "",
                idCard: "",
                aadhar: "",
                sslc: "",
                puc: "",
                admission1: "",
                admission2: "",
            },
        },
    });

    const {
        register: registerManager,
        handleSubmit: handleSubmitManager,
        formState: { errors: errorsManager },
        setValue: setValueManager,
    } = useForm<z.infer<typeof managerFormSchema>>({
        resolver: zodResolver(managerFormSchema),
        defaultValues: {
            name: "",
            usn: "",
            teamManager: true,
            phone: "",
            documents: {
                photo: "",
                idCard: "",
            },
        },
    });

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
            // router.push("/register/getallregister");
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error registering:", error.message);
                toast.error(error.message || "An error occurred.");
            }
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
            // router.push("/register/getallregister");
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error registering manager:", error.message);
                toast.error(error.message || "An error occurred.");
            }
        }
    };

    return (
        <Tabs defaultValue="participant" className="w-full px-10">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="participant">
                    Participant & Accompanist
                </TabsTrigger>
                <TabsTrigger value="manager">Team Manager</TabsTrigger>
            </TabsList>

            <TabsContent value="participant">
                <Card>
                    <form
                        onSubmit={handleSubmit(
                            onParticipantSubmit,
                            onParticipantError
                        )}
                    >
                        <CardHeader>
                            <CardTitle className="text-center">
                                Register (Participant/Accompanist)
                            </CardTitle>
                            <CardDescription className="text-center">
                                Add details for Participant or Accompanist
                                roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Basic Information Fields */}
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
                                <div className="w-full md:w-1/3 space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        {...register("name")}
                                        id="name"
                                        placeholder="Full Name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3 space-y-1.5">
                                    <Label htmlFor="username">USN</Label>
                                    <Input
                                        {...register("usn")}
                                        id="usn"
                                        placeholder="1GA21AI012"
                                    />
                                    {errors.usn && (
                                        <p className="text-red-500 text-sm">
                                            {errors.usn.message}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3 space-y-1.5">
                                    <Label htmlFor="phone">Phone Number</Label>
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

                            {/* Event Selection */}
                            <div className="bg-card text-card-foreground p-4 rounded-md">
                                <h2
                                    className="text-2xl font-semibold text-foreground mb-4"
                                    aria-label="Available events"
                                    tabIndex={0}
                                >
                                    Select Your Events
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
                                                                            className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 flex flex-col h-full ${
                                                                                isSelected
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {REQUIRED_DOCUMENTS.map((doc) => {
                                        const isUploaded =
                                            !!documentUrls[doc.id];
                                        return (
                                            <div
                                                key={doc.id}
                                                className={`space-y-1.5 border rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-2 ${
                                                    isUploaded
                                                        ? "border-green-500 border-2"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                <Label htmlFor={doc.id}>
                                                    {doc.label}
                                                </Label>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {doc.hint}
                                                </p>
                                                {isUploaded ? (
                                                    <div className="w-full h-[244px] flex flex-col rounded-[var(--radius)] items-center justify-end p-12 space-y-2 bg-gradient-to-t from-green-50 to-transparent">
                                                        <p className="text-green-500 flex items-center gap-1 pb-10">
                                                            Upload Complete
                                                            <VerifiedIcon />
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
                        <CardFooter>
                            <Button type="submit">Save changes</Button>
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
                            <CardTitle className="text-center">
                                Team Manager
                            </CardTitle>
                            <CardDescription className="text-center">
                                Manager details here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Basic Information Fields */}
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
                                <div className="w-full md:w-1/3 space-y-1.5">
                                    <Label htmlFor="managerName">Name</Label>
                                    <Input
                                        {...registerManager("name")}
                                        id="managerName"
                                        placeholder="Full Name"
                                    />
                                    {errorsManager.name && (
                                        <p className="text-red-500 text-sm">
                                            {errorsManager.name.message}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3 space-y-1.5">
                                    <Label htmlFor="managerUsn">USN</Label>
                                    <Input
                                        {...registerManager("usn")}
                                        id="managerUsn"
                                        placeholder="1GA21AI012"
                                    />
                                    {errorsManager.usn && (
                                        <p className="text-red-500 text-sm">
                                            {errorsManager.usn.message}
                                        </p>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3 space-y-1.5">
                                    <Label htmlFor="managerPhone">
                                        Phone Number
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
                                                className={`space-y-1.5 border rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-2 ${
                                                    isUploaded
                                                        ? "border-green-500 border-2"
                                                        : "border-gray-300"
                                                }`}
                                            >
                                                <Label htmlFor={doc.id}>
                                                    {doc.label}
                                                </Label>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {doc.hint}
                                                </p>
                                                {isUploaded ? (
                                                    <div className="w-full h-[244px] flex flex-col rounded-[var(--radius)] items-center justify-end p-12 space-y-2 bg-gradient-to-t from-green-50 to-transparent">
                                                        <p className="text-green-500 flex items-center gap-1 pb-10">
                                                            Upload Complete
                                                            <VerifiedIcon />
                                                        </p>
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
                        <CardFooter>
                            <Button type="submit">Save Manager</Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
