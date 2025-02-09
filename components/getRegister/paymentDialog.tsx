"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CalendarClock, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";

export function PaymentDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [arrivalDate, setArrivalDate] = useState("");
    const router = useRouter();

    const [time, setTime] = useState({ hours: "12", minutes: "00", ampm: "AM" });

    const handleProceed = async () => {
        if (!arrivalDate || !time) {
            alert("Please enter both date and time of arrival.");
            return;
        }

        const arrivalTime = `${time.hours}:${time.minutes} ${time.ampm}`;
        console.log("Selected Arrival Time:", arrivalTime);
        try {
            const response = await fetch('/api/postdatetime', {
                method: "POST",
                body: JSON.stringify({
                    dateOfArrival: arrivalDate,
                    timeOfArrival: arrivalTime
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const data = await response.json();
            console.log(data);

            if (data.success === true) {
                alert("saved successfully");

                router.push("/register/paymentinfo");
            }
            else {
                alert("message");
            }
        } catch (error: unknown) {
            console.log("something went wrong")
        }
    };

    return (
        <>
            <Button
                variant="default"
                className="border bg-primary relative text-white hover:bg-primary hover:text-white hover:scale-105 transition-all"
                onClick={() => setIsOpen(true)}
            >
                <CreditCard className="mr-2 h-4 w-4" />
                Go to payments
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Arrival Details</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-3">
                        {/* Date Selection */}
                        <Label>Date of Arrival</Label>
                        <Select onValueChange={setArrivalDate}>
                            <SelectTrigger className="w-[200px] border border-gray-300 p-2 rounded-md">
                                <SelectValue placeholder="Select Date of Arrival" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2025-03-24">24 March 2025</SelectItem>
                                <SelectItem value="2025-03-25">25 March 2025</SelectItem>
                                <SelectItem value="2025-03-26">26 March 2025</SelectItem>
                                <SelectItem value="2025-03-27">27 March 2025</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Time Selection */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between">
                                    {`${time.hours}:${time.minutes} ${time.ampm}`}
                                    <CalendarClock className="w-4 h-4 ml-2" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[250px] flex flex-col gap-2">
                                <Label>Select Time</Label>
                                <div className="flex items-center gap-2">
                                    {/* Hours Dropdown */}
                                    <Select onValueChange={(value) => setTime({ ...time, hours: value })} defaultValue={time.hours}>
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue placeholder="Hour" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[...Array(12)].map((_, i) => (
                                                <SelectItem key={i + 1} value={`${i + 1}`}>{i + 1}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Minutes Dropdown */}
                                    <Select onValueChange={(value) => setTime({ ...time, minutes: value })} defaultValue={time.minutes}>
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue placeholder="Minutes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["00", "15", "30", "45"].map((min) => (
                                                <SelectItem key={min} value={min}>{min}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* AM/PM Dropdown */}
                                    <Select onValueChange={(value) => setTime({ ...time, ampm: value })} defaultValue={time.ampm}>
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue placeholder="AM/PM" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AM">AM</SelectItem>
                                            <SelectItem value="PM">PM</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Proceed Button */}
                        <Button className="mt-3" onClick={handleProceed}>
                            Proceed to Payments
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
