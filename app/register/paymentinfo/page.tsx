"use client"; // Enable client-side data fetching
import image1 from '@/public/images/4000.jpg'
import image2 from '@/public/images/8000.jpg'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadDropzone } from '@/utils/uploadthing';
import Image, { StaticImageData } from "next/image";

import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from 'next/link';

interface MyCustomEvent {
    id: number;
    eventName: string;
}

interface PaymentInput {
    txnNumber: string;
    Amount: number;
    paymentUrl: string;
}

export default function EventsPage() {
    
    const [events, setEvents] = useState<MyCustomEvent[]>([]);

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

    const paymentAmount = events.length > 10 ? 8000 : 4000;
    const imageSrc = events.length > 10 ? image2 : image1;

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            txnNumber: "",
            Amount: paymentAmount,
            paymentUrl: "",
        },
    });
    const onSubmit: SubmitHandler<PaymentInput> = async (data) => {
        const response = await fetch("/api/paymentGateway", {
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success("Submitted");
        } else {
            toast.error("Internal Server Error");
        }
    };

    return (
        <div className="min-h-screen mt-16 py-10 flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
            <Card className="w-full max-w-4xl bg-card text-card-foreground">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-yellow-500 font-semibold">
                        Total No of Events: {events.length} events
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <EventsList events={events} />
                        <PaymentDetails
                            paymentAmount={paymentAmount}
                            imageSrc={imageSrc}
                        />
                    </div>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="space-y-2">
                            <Label htmlFor="txnNumber">
                                Transaction Number / ID{" "}
                                <span className="text-red-700">*</span>
                            </Label>
                            <Controller
                                control={control}
                                name="txnNumber"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <Input
                                        id="txnNumber"
                                        type="text"
                                        {...field}
                                        placeholder="Enter your transaction ID"
                                    />
                                )}
                            />
                            {errors.txnNumber && (
                                <small className="text-red-700 mt-6 font-semibold">
                                    The Transaction Number / ID is required{" "}
                                </small>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="paymentScreenshot">
                                Payment Screenshot{" "}
                                <span className="text-red-700">*</span>
                            </Label>
                            <Controller
                                control={control}
                                name="paymentUrl"
                                rules={{ required: true }}
                                render={() => (
                                    <UploadDropzone
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            const urlKey = res[0].key;
                                            setValue('paymentUrl', urlKey);
                                            toast.success('payment screenshot uploaded');
                                        }}
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        onUploadError={(error: Error) => {
                                            // Do something with the error.
                                            toast.error(
                                                "payment screenshot Error"
                                            );
                                        }}
                                    />
                                )}
                            />
                            {errors.paymentUrl && (
                                <small className="text-red-700 mt-6 font-semibold">
                                    Payment Screenshot File is required
                                </small>
                            )}
                        </div>
                        <Button className="w-full my-2" type="submit">
                            Submit
                        </Button>
                        <Link href="getallregister">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full my-2"
                            >
                                Go Back
                            </Button>
                        </Link>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function EventsList({ events }: { events: MyCustomEvent[] }) {
    return (
        <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Events List</h2>
            <ul className="space-y-2 max-h-[300px] overflow-y-auto">
                {events.map((event, index) => (
                    <li
                        key={index}
                        className="py-2 font-medium hover:bg-secondary transition-all rounded px-2"
                    >
                        {index + 1}. {event.eventName}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function PaymentDetails({
    paymentAmount,
    imageSrc,
}: {
    paymentAmount: number;
    imageSrc: StaticImageData;
}) {
    return (
        <div className="border rounded-lg p-4 space-y-4">
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <p className="text-lg">Amount To Be Paid: ₹{paymentAmount}</p>
            <div className="flex justify-center">
                <Image
                    src={imageSrc}
                    alt="Payment illustration"
                    className="rounded-lg border border-border"
                    width={200}
                    height={200}
                />
            </div>
            <BankDetails />
        </div>
    );
}

function BankDetails() {
    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold">Bank Details</h3>
            <p>
                <span className="font-medium">Bank Name:</span> Union Bank
            </p>
            <p>
                <span className="font-medium">Account Number:</span>{" "}
                1234567891021
            </p>
            <p>
                <span className="font-medium">IFSC Code:</span> AB565652
            </p>
        </div>
    );
}
