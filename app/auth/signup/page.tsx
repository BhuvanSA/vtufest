"use client";

import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import axios from "axios";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/LoadingButton";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";

const signupSchema = z.object({
    college: z.string().min(3, "College name must be at least 3 characters"),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be at most 15 digits"),
    email: z.string().email("Invalid email address"),
    otp: z
        .string()
        .length(6, "OTP must be 6 digits")
        .regex(/^\d{6}$/, "OTP must be numeric"),
});

export default function SignUp() {
    const router = useRouter();
    const [isSendingOTP, setIsSendingOTP] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            college: "",
            phone: "",
            email: "",
            otp: "",
        },
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendTimer]);

    const sendOTP = async () => {
        const email = form.getValues("email");
        if (!email) {
            form.setError("email", { message: "Please enter your email" });
            return;
        }
        setIsSendingOTP(true);
        try {
            const response = await axios.post("/api/sendEmailOtp", { email });
            if (response.data.success) {
                form.clearErrors("email");
                toast.success(
                    "OTP sent successfully! Check your email. OTP is valid for 5 minutes."
                );
                setResendTimer(60); // 60 seconds cooldown
            } else {
                form.setError("email", {
                    message: response.data.message || "Failed to send OTP.",
                });
                toast.error(
                    response.data.message ||
                        "Failed to send OTP. Please try again."
                );
            }
        } catch (error: any) {
            console.error("Failed to send OTP:", error);
            form.setError("email", {
                message: "Failed to send OTP. Please try again.",
            });
            toast.error("Failed to send OTP. Please try again.");
        } finally {
            setIsSendingOTP(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof signupSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/signup", values);
            if (response.data.success) {
                toast.success("Signup successful! Redirecting to login...");
                router.push("/auth/signin");
            } else {
                if (
                    response.data.error === "Invalid OTP" ||
                    response.data.error === "Invalid OTP provided."
                ) {
                    form.setError("otp", {
                        message: "Invalid OTP. Please try again.",
                    });
                    toast.error("Invalid OTP. Please try again.");
                } else if (response.data.error === "User already exists") {
                    form.setError("email", {
                        message: "A user with this email already exists.",
                    });
                    toast.error("A user with this email already exists.");
                } else {
                    toast.error(
                        response.data.message ||
                            "Signup failed. Please try again."
                    );
                }
            }
        } catch (error: any) {
            console.error("Signup failed:", error);
            toast.error("An error occurred during signup.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-6">
                        <Image
                            src="/images/college-logo.png"
                            alt="College Logo"
                            width={100}
                            height={100}
                            priority
                            className="object-contain"
                        />
                    </div>
                    <CardTitle className="text-2xl text-center font-bold">
                        Sign Up
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="college"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>College Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your college name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your phone number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="example@domain.com"
                                                    {...field}
                                                    disabled={isSendingOTP}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={sendOTP}
                                                    disabled={
                                                        isSendingOTP ||
                                                        resendTimer > 0
                                                    }
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                                >
                                                    {isSendingOTP
                                                        ? "Sending..."
                                                        : resendTimer > 0
                                                        ? `Resend OTP (${resendTimer}s)`
                                                        : "Send OTP"}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter OTP</FormLabel>
                                        <FormControl>
                                            <InputOTP
                                                maxLength={6}
                                                value={field.value}
                                                onChange={field.onChange}
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <LoadingButton type="submit" loading={isLoading}>
                                Sign Up
                            </LoadingButton>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">
                                Already Registered?
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push("/auth/signin")}
                    >
                        Sign In
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
