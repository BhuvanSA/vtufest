"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import axios from "axios";
import vtulogo from "@/public/images/vtulogo.png";
import { toast } from "sonner";
import interactLogo from "@/public/images/INTERACT-4.png";
import bgImage from "../../../components/images/GATBGIMG.png"; // Your background image import
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailList } from "@/data/emailList";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { colleges } from "@/data/colleges";

const signupSchema = z
    .object({
        collegeName: z
            .string()
            .min(3, "College name must be at least 3 characters"),
        collegeCode: z
            .string()
            .min(3, "College name must be at least 3 characters")
            .max(3),
        region: z
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
            collegeName: "",
            collegeCode: "",
            region: "",
            phone: "",
            email: "",
            otp: "",
        },
    });

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
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
        console.log("Form values", values);
        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (data.success) {
                toast("Signup successful! Redirecting to login...");
                router.push("/auth/signin");
            } else {
                const { errors } = data;
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
        <>
            <div className="pt-24 min-h-screen flex items-center justify-center bg-gradient-to-br  to-secondary p-4"
                style={{
                    backgroundImage: `url(${bgImage.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                }}
            >
                <Card className="w-full max-w-md bg-card text-card-foreground" >
                    <CardHeader className="space-y-1">
                        <div className="flex items-center flex-col text-blue-800 justify-center mb-6 font-bold text-2xl leading-6 tracking-wider">
                            <h1 className="text-wrap text-center">Global Academy of Technology</h1>
                            <br />
                            <h1 className="text-yellow-600">24th VTU Youth Fest</h1>
                        </div>
                        <div className="flex gap-2 flex-col sm:flex-row sm:gap-0 items-center">
                            <Image
                                src="/images/college-logo.png"
                                alt="College Logo"
                                width={85}
                                height={80}
                                priority
                                className="object-contain "
                            />
                            <Image
                                src={interactLogo}
                                alt="College Logo"
                                width={170}
                                height={90}
                                priority
                                className="object-contain mx-2"
                            />
                            <Image
                                src={vtulogo}
                                alt="College Logo"
                                width={120}
                                height={120}
                                priority
                                className="object-contain "
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
                                    name="collegeCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-foreground">College</FormLabel>
                                            <Select onValueChange={(value) => {
                                                // Find the selected college and region
                                                const selectedRegion = colleges.find(region =>
                                                    region.colleges.some(college => college.code === value)
                                                );
                                                const selectedCollege = selectedRegion?.colleges.find(
                                                    college => college.code === value
                                                );
                                                // Up date collegeCode and region in the form
                                                form.setValue("collegeCode", value);
                                                form.setValue("collegeName", selectedCollege?.name as string);
                                                form.setValue("region", selectedRegion?.region || "");
                                            }} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-background border-input">
                                                        <SelectValue placeholder="Select your college" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {colleges.map((region) => (
                                                        <SelectGroup key={region.region}>
                                                            <SelectLabel>{region.region}</SelectLabel>
                                                            {region.colleges.map((college) => (
                                                                <SelectItem key={college.code} value={college.code}>
                                                                    {college.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                    render={({ field }) => (
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
                                                        disabled={isSendingOTP || resendTimer > 0}
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
                                                Enter OTP Number
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
                                {/* <FormField
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
                            /> */}

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
                            Log In
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}




