"use client";

import { useState, useEffect } from "react";
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
    CardHeader,
    CardTitle,
    CardFooter,
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

const resetPasswordSchema = z
    .object({
        email: z.string().email("Invalid email address"),
        otp: z
            .string()
            .length(6, "OTP must be 6 digits")
            .regex(/^\d{6}$/, "OTP must be numeric"),
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"], // Error will show under `confirmPassword` field
    });

export default function ResetPassword() {
    const router = useRouter();
    const [isSendingOTP, setIsSendingOTP] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            email: "",
            otp: "",
            newPassword: "",
            confirmPassword: "",
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
            form.setError("email", {
                message: "Failed to send OTP. Please try again.",
            });
            toast.error("Failed to send OTP. Please try again.");
            console.error(error);
        } finally {
            setIsSendingOTP(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/resetpassword", values);
            if (response.data.success) {
                toast.success(
                    "Password reset successful! Redirecting to login..."
                );
                router.push("/auth/signin");
            } else {
                if (response.data.error === "Invalid OTP") {
                    form.setError("otp", {
                        message: "Invalid OTP. Please try again.",
                    });
                    toast.error("Invalid OTP. Please try again.");
                } else if (response.data.error === "User does not exist") {
                    form.setError("email", {
                        message: "No user found with this email.",
                    });
                    toast.error("No user found with this email.");
                } else {
                    toast.error(
                        response.data.message ||
                            "Password reset failed. Please try again."
                    );
                }
            }
        } catch (error: any) {
            toast.error("An error occurred during password reset.", error);
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
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to reset your password
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
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your new password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Confirm your new password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <LoadingButton type="submit" loading={isLoading}>
                                Reset Password
                            </LoadingButton>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push("/auth/signin")}
                    >
                        Back to Sign In
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
