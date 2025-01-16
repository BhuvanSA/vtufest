"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import bgImage from "../../../components/images/GATBGIMG.png"; 
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
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import Image from "next/image";

const signupSchema = z
    .object({
        college: z
            .string()
            .min(3, "College name must be at least 3 characters"),
        phone: z
            .string()
            .min(10, "Phone number must be at least 10 digits")
            .max(15, "Phone number must be at most 15 digits"),
        email: z.string().email("Invalid email address"),
        otp: z
            .string()
            .length(6, "OTP must be 6 digits")
            .regex(/^\d{6}$/, "OTP must be numeric"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
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
            password: "",
            confirmPassword: "",
        },
    });

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
        } catch (error: unknown) {
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
                toast("Signup successful! Redirecting to login...");
                router.push("/auth/signin");
            } else {
                const { errors } = response.data;
                if (errors) {
                    for (const field in errors) {
                        if (field === "general") {
                            toast.error(errors[field]);
                        } else {
                            form.setError(field as keyof typeof form.control, {
                                message: errors[field],
                            });
                            toast.error(errors[field]);
                        }
                    }
                } else {
                    toast.error("Signup failed. Please try again.");
                }
            }
        } catch (error: unknown) {
            console.error("Signup failed:", error);
            toast.error("An error occurred during signup.");
        } finally {
            setIsLoading(false);
        }
    };
    // from-background
    return (
        <div className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br  to-secondary p-4"
        style={{
            backgroundImage: `url(${bgImage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
        }}
        >
            <Card className="w-full max-w-md bg-card text-card-foreground">
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
                    <CardTitle className="text-2xl text-center font-bold text-foreground">
                        Sign Up
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
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
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            College Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background border-input"
                                                placeholder="Enter your college name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            Phone Number
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background border-input"
                                                placeholder="Enter your phone number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    className="bg-background border-input"
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
                                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary/90"
                                                >
                                                    {isSendingOTP
                                                        ? "Sending..."
                                                        : resendTimer > 0
                                                        ? `Resend OTP (${resendTimer}s)`
                                                        : "Send OTP"}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            Enter OTP
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex justify-center">
                                                <InputOTP
                                                    maxLength={6}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    className="bg-background"
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot
                                                            index={0}
                                                        />
                                                        <InputOTPSlot
                                                            index={1}
                                                        />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot
                                                            index={2}
                                                        />
                                                        <InputOTPSlot
                                                            index={3}
                                                        />
                                                    </InputOTPGroup>
                                                    <InputOTPSeparator />
                                                    <InputOTPGroup>
                                                        <InputOTPSlot
                                                            index={4}
                                                        />
                                                        <InputOTPSlot
                                                            index={5}
                                                        />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="bg-background border-input"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="bg-background border-input"
                                                placeholder="Confirm your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />

                            <LoadingButton
                                type="submit"
                                loading={isLoading}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Sign Up
                            </LoadingButton>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            {/* Optional Divider Text */}
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full border-border hover:bg-secondary"
                        onClick={() => router.push("/auth/signin")}
                    >
                        Sign In
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
