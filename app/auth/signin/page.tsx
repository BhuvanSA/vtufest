"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import Image from "next/image";
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
import { useAuthContext } from "@/contexts/auth-context";
// import { set } from "date-fns";

const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .min(1, "Email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function SignIn() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { setIsLoggedIn } = useAuthContext();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/login", {
                email: values.email,
                password: values.password,
            });
            if (response.data.success) {
                setIsLoggedIn(true);
                router.push("/register/eventregister");
            } else {
                form.setError("email", {
                    type: "manual",
                    message: "Invalid credentials",
                });
                form.setError("password", {
                    type: "manual",
                    message: "Invalid credentials",
                });
                setError(response.data.message);
                setIsLoading(false);
            }
        } catch (error: unknown) {
            setError("An error occurred during login");
            console.error(error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-center mb-6">
                        <Image
                            src="/images/college-logo.png"
                            alt="College Logo"
                            width={80}
                            height={80}
                            priority
                            className="object-contain"
                        />
                    </div>
                    <CardTitle className="text-2xl text-center font-bold">
                        Sign In
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the platform
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
                                            <Input
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <div className="text-sm text-red-500 text-center">
                                    {error}
                                </div>
                            )}
                            <LoadingButton type="submit" loading={isLoading}>
                                Sign In
                            </LoadingButton>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="relative w-full">
                        <Button
                            variant="link"
                            className="w-full -mt-4"
                            onClick={() => router.push("/auth/forgotpassword")}
                        >
                            Forgot Password?
                        </Button>
                    </div>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-muted-foreground">
                                Not yet Registered?
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => router.push("/auth/signup")}
                    >
                        Sign Up
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
