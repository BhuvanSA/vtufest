"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadDropzone } from "@/utils/uploadthing";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { VerifiedIcon } from "lucide-react";
import { Event } from "@/app/register/addRegistrant/page";

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

type DocumentUrls = {
    photo: string;
    idCard: string;
    aadhar: string;
    sslc: string;
    puc: string;
    admission1: string;
    admission2: string;
};

type SelectRolesAndEventsProps = {
    allEvents: Event[];
};

const participantSchema = z.object({
    name: z.string().min(1, "Required"),
    username: z.string().min(1, "Required"),
    phoneno: z.string().min(10, "Enter valid phone number"),
    documents: z.object({
        photo: z.string().url().optional(),
        idCard: z.string().url().optional(),
        aadhar: z.string().url().optional(),
        sslc: z.string().url().optional(),
        puc: z.string().url().optional(),
        admission1: z.string().url().optional(),
        admission2: z.string().url().optional(),
    }),
});

const managerSchema = z.object({
    managerName: z.string().min(1, "Required"),
    managerPhone: z.string().min(10, "Enter valid phone number"),
    // ... any manager-specific fields ...
});

const SelectRolesAndEvents: React.FC<SelectRolesAndEventsProps> = ({
    allEvents,
}) => {
    const groupedEvents = allEvents.reduce((acc, event) => {
        if (!acc[event.category]) {
            acc[event.category] = [];
        }
        acc[event.category].push(event);
        return acc;
    }, {} as Record<string, Event[]>);
    const isDisabled = allEvents.length === 0;
    const [documentUrls, setDocumentUrls] = useState<Record<string, string>>(
        {}
    );
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(participantSchema),
        defaultValues: {
            name: "",
            username: "",
            phoneno: "",
            documents: {},
        },
    });

    const onParticipantSubmit = (data: any) => {
        console.log("Participant Data ->", data);
    };

    const onManagerSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const result = managerSchema.safeParse({
            managerName: "Fake Input",
            managerPhone: "1234567890",
        });
        if (!result.success) {
            console.log("Manager Error:", result.error.issues);
        } else {
            console.log("Manager Data ->", result.data);
        }
    };

    async function handleDeleteFromUploadThing(fileKey: string) {
        try {
            const res = await fetch("/api/deleteFiles", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ files: [fileKey] }),
            });
            if (res.ok) {
                console.log("File deleted successfully");
            } else {
                console.error("Error deleting file");
            }
        } catch (error) {
            console.error("Error deleting file", error);
        }
    }

    const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

    const onToggleSelect = (eventNo: number) => {
        setSelectedEvents((prev) =>
            prev.includes(eventNo)
                ? prev.filter((no) => no !== eventNo)
                : [...prev, eventNo]
        );
    };

    return (
        <Tabs defaultValue="participant" className="w-full px-10">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="participant">
                    Participant/Accompanist
                </TabsTrigger>
                <TabsTrigger value="manager">Team Manager</TabsTrigger>
            </TabsList>

            <TabsContent value="participant">
                <Card>
                    <form onSubmit={handleSubmit(onParticipantSubmit)}>
                        <CardHeader>
                            <CardTitle className="text-center">
                                Participant
                            </CardTitle>
                            <CardDescription className="text-center">
                                Add participant details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
                                <div className="w-full md:w-1/3 space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Bhuvan S A"
                                        {...register("name")}
                                    />
                                    {errors.name && (
                                        <p>{errors.name.message}</p>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3 space-y-1.5">
                                    <Label htmlFor="username">USN</Label>
                                    <Input
                                        id="username"
                                        placeholder="1GA21AI012"
                                        {...register("username")}
                                    />
                                    {errors.username && (
                                        <p>{errors.username.message}</p>
                                    )}
                                </div>
                                <div className="w-full md:w-1/3 space-y-1.5">
                                    <Label htmlFor="phoneno">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phoneno"
                                        placeholder="9876543210"
                                        {...register("phoneno")}
                                    />
                                    {errors.phoneno && (
                                        <p>{errors.phoneno.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="bg-card text-card-foreground">
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
                                            ([category, events]) => {
                                                const selectedCount =
                                                    events.filter((evt) =>
                                                        selectedEvents.includes(
                                                            evt.eventNo
                                                        )
                                                    ).length;
                                                return (
                                                    <AccordionItem
                                                        key={category}
                                                        value={category}
                                                    >
                                                        <AccordionTrigger
                                                            className="flex justify-between items-center w-full px-4 py-2 text-left rounded-lg hover:bg-secondary/80 transition-all duration-200"
                                                            aria-label={`Show or hide events for ${category}`}
                                                        >
                                                            <span className="text-lg font-medium">
                                                                {category} (
                                                                {events.length})
                                                            </span>
                                                            {selectedCount >
                                                                0 && (
                                                                <div className="flex ml-auto mr-2">
                                                                    <span
                                                                        className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                                                        aria-live="polite"
                                                                    >
                                                                        {
                                                                            selectedCount
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1.5">
                                                                {events.map(
                                                                    (event) => {
                                                                        const isSelected =
                                                                            selectedEvents.includes(
                                                                                event.eventNo
                                                                            );
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
                                                                                aria-label={`Select or deselect ${event.eventName}`}
                                                                                onClick={() =>
                                                                                    !isDisabled &&
                                                                                    onToggleSelect(
                                                                                        event.eventNo
                                                                                    )
                                                                                }
                                                                                onKeyDown={(
                                                                                    e
                                                                                ) => {
                                                                                    if (
                                                                                        !isDisabled &&
                                                                                        (e.key ===
                                                                                            "Enter" ||
                                                                                            e.key ===
                                                                                                " ")
                                                                                    ) {
                                                                                        onToggleSelect(
                                                                                            event.eventNo
                                                                                        );
                                                                                    }
                                                                                }}
                                                                                className={`p-4 border-2 rounded-lg cursor-pointer transition duration-300 outline-none focus:ring-2 focus:ring-blue-500 flex flex-col h-full ${
                                                                                    isSelected
                                                                                        ? "border-primary bg-primary/10"
                                                                                        : "border-border bg-card hover:border-blue-200"
                                                                                } ${
                                                                                    isDisabled
                                                                                        ? "opacity-50 cursor-not-allowed"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                                                                    {
                                                                                        event.eventName
                                                                                    }
                                                                                </h3>
                                                                                <div className="mt-auto">
                                                                                    <div className="flex items-end">
                                                                                        <div className="w-1/2">
                                                                                            <p className="text-sm text-muted-foreground">
                                                                                                Max
                                                                                                Participants:{" "}
                                                                                                <span className="font-medium text-foreground">
                                                                                                    {
                                                                                                        event.maxParticipant
                                                                                                    }
                                                                                                </span>
                                                                                            </p>
                                                                                            <p className="text-sm text-muted-foreground">
                                                                                                Max
                                                                                                Accompanists:{" "}
                                                                                                <span className="font-medium text-foreground">
                                                                                                    {
                                                                                                        event.maxAccompanist
                                                                                                    }
                                                                                                </span>
                                                                                            </p>
                                                                                        </div>
                                                                                        <div className="w-1/2">
                                                                                            <Select>
                                                                                                <SelectTrigger>
                                                                                                    <SelectValue placeholder="Select a role" />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                    <SelectGroup>
                                                                                                        <SelectLabel>
                                                                                                            as
                                                                                                        </SelectLabel>
                                                                                                        {event.registeredParticipant <
                                                                                                            event.maxParticipant && (
                                                                                                            <SelectItem value="Participant">
                                                                                                                Participant
                                                                                                            </SelectItem>
                                                                                                        )}
                                                                                                        {event.registeredAccompanist <
                                                                                                            event.maxAccompanist && (
                                                                                                            <SelectItem value="Accompanist">
                                                                                                                Accompanist
                                                                                                            </SelectItem>
                                                                                                        )}
                                                                                                    </SelectGroup>
                                                                                                </SelectContent>
                                                                                            </Select>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                );
                                            }
                                        )}
                                    </Accordion>
                                )}
                            </div>

                            <div className="mt-3">
                                <h2
                                    className="text-2xl font-semibold text-foreground mb-4"
                                    aria-label="Available events"
                                    tabIndex={0}
                                >
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
                                                    <div className="w-full h-[244px] flex flex-col rounded-[var(--radius)] items-center justify-end p-12 space-y-2 bg-gradient-to-t from-green-50 dark:from-green-950 to-transparent">
                                                        <p className="text-green-500 flex items-center gap-1 pb-10">
                                                            Upload Complete
                                                            <VerifiedIcon />
                                                        </p>
                                                        <Button
                                                            variant="outline"
                                                            onClick={async () => {
                                                                await handleDeleteFromUploadThing(
                                                                    documentUrls[
                                                                        doc.id
                                                                    ]
                                                                );
                                                                setDocumentUrls(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [doc.id]:
                                                                            "",
                                                                    })
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
                                                                setDocumentUrls(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        [doc.id]:
                                                                            res[0]
                                                                                .key,
                                                                    })
                                                                );
                                                            }
                                                            toast.success(
                                                                `${doc.label} Upload Completed`
                                                            );
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
                    <CardHeader>
                        <CardTitle className="text-center">
                            Team Manager
                        </CardTitle>
                        <CardDescription className="text-center">
                            Manager details here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onManagerSubmit}>
                            <div className="flex flex-col gap-4 mb-6">
                                {/* Example manager fields */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="managerName">
                                        Manager Name
                                    </Label>
                                    <Input
                                        id="managerName"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="managerPhone">Phone</Label>
                                    <Input
                                        id="managerPhone"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                            <Button type="submit">Save Manager</Button>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};

export default SelectRolesAndEvents;
