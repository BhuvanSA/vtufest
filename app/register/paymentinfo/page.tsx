"use client"; // Enable client-side data fetching
import image1 from "@/public/images/4000.jpg";
import image2 from "@/public/images/8000.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadDropzone } from "@/utils/uploadthing";
import Image, { StaticImageData } from "next/image";

import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { LoadingButton } from "@/components/LoadingButton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

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

    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [paymentUrl, setPaymentUrl] = useState<string>("");
    const [isUploaded, setIsUploaded] = useState<boolean>(false);
    const [paymentStatus, setPaymentStatus] = useState<boolean>(false);
    const [paymentDone, setPaymentDone] = useState<boolean>(false);
    const [paymentStatusInfo,setPaymentStatusInfo] = useState<string>("");
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


        const fetchPaymentInfo = async () => {
            try {
                const response = await fetch("/api/getPaymentInfo");
                const r = await response.json();
                console.log(r)
                let paymentStatus = false;
                if (r.paymentInfo.paymentUrl === null) {
                    paymentStatus = false;
                    setPaymentStatus(false)
                } else {
                    paymentStatus = true;
                    setPaymentStatus(true);
                    console.log("fdas",r.paymentInfo.PaymentVerified);
                    setPaymentStatusInfo(r.paymentInfo.PaymentVerified);
                    setPaymentDone(true);
                }

            } catch (error: unknown) {
                console.error("Failed to fetch events:", error);
            }
        }
        fetchPaymentInfo();
        fetchEvents();
    }, []);

    const paymentAmount = events.length > 10 ? 8000 : 4000;
    const imageSrc = events.length > 10 ? image2 : image1;

    async function handleDeleteFromUploadThing(fileId: string) {
        try {
            await fetch("/api/deleteFiles", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ files: [fileId] }),
            });
            console.log(fileId);
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    }

    const [isOpen,setIsOpen] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
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
            toast.error(responseData.message);
        }
        setPaymentStatus(true);
        router.push("/auth/logout")
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
                    {!paymentDone ?
                    <>
                        <form
                            className="space-y-4"
                            
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
                                <div className="space-y-2">
                                    <Label htmlFor="paymentScreenshot">
                                        Payment Screenshot <span className="text-red-700">*</span>
                                    </Label>
                                    <Controller
                                        control={control}
                                        name="paymentUrl"
                                        rules={{ required: true }}
                                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                        render={({ field }) => (
                                            <div
                                                className={`space-y-1.5 border rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-2 ${isUploaded ? "border-green-500 border-2" : "border-gray-300"
                                                    }`}
                                            >
                                                {isUploaded ? (
                                                    <div className="w-full h-[244px] flex flex-col rounded-[var(--radius)] items-center justify-end p-12 space-y-2 bg-gradient-to-t from-green-50 to-transparent">
                                                        <p className="text-green-500 flex items-center gap-1 pb-10">
                                                            Upload Complete
                                                        </p>
                                                        <LoadingButton
                                                            type="button"
                                                            onClick={async() => {
                                                                setIsUploaded(false);
                                                                await  handleDeleteFromUploadThing(getValues("paymentUrl"));
                                                                setValue("paymentUrl", "");
                                                                setPaymentUrl("");
                                                            }}
                                                        >
                                                            Edit (Re-upload)
                                                        </LoadingButton>
                                                    </div>
                                                ) : (
                                                    <UploadDropzone
                                                        endpoint="imageUploader"
                                                        onClientUploadComplete={(res) => {
                                                            if (res && res[0]) {
                                                                setPaymentUrl(res[0].key);
                                                                setValue("paymentUrl", res[0].key);
                                                                setIsUploaded(true);
                                                                toast.success("Upload Completed");
                                                            }
                                                        }}
                                                        onUploadError={(error: Error) => {
                                                            toast.error(`Error: ${error.message} Uploading`);
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                    {errors.paymentUrl && (
                                        <small className="text-red-700 mt-6 font-semibold">
                                            Payment Screenshot File is required
                                        </small>
                                    )}
                                </div>
                            </div>
                            
                        </form>
                        <Button className="w-full my-2" onClick={()=>setIsOpen((prev)=> !prev)} >
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
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Confirm Payment Submission</DialogTitle>
                                    </DialogHeader>
                                    <p>Are you sure you want to submit the payment details?</p>
                                    <p className="text-red-500">Once After Payment, You cannot make Changes</p>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                                        <Button onClick={handleSubmit(onSubmit)}>Confirm</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                         </>: <>{paymentStatusInfo==="PENDING"? <h2 className="text-lg text-primary text-center">Payment Verification is {paymentStatusInfo}</h2>
                                    : paymentStatusInfo==="COMPLETED"? <h2 className="text-lg text-green-500 text-center"> Payment Verification is {paymentStatusInfo}</h2>:
                                    <h2 className="text-lg text-red-500 text-center">Payment Verification is {paymentStatusInfo}</h2> 
                                }</>}
                        <p className="text-sm text-red-500 text-center mt-0" >Confirmation mail will be sent to your registered E-mail ID</p>
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
                <span className="font-medium">Account Holder Name:</span> Global
                Academy Of Technology
            </p>
            <p>
                <span className="font-medium">UPI ID:</span>{" "}
                71159801@ubin
            </p>
           
        </div>
    );
}
