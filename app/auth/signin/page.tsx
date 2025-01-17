"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import vtulogo from "@/public/images/vtulogo.png";
import Image from "next/image";
import interactLogo from "@/public/images/INTERACT-4.png";
import bgImage from "../../../components/images/GATBGIMG.png"; // Your background image import

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
import { loginSchema } from "@/lib/schemas/auth";
import { toast } from "sonner";
import Link from "next/link";

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
                toast.success("Login successful!", {
                    description: "You have been logged in successfully",
                });
                router.push("/register/firstEventSelection");
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
        <div
            className="mt-28 min-h-screen flex items-center justify-center p-4"
            style={{
                backgroundImage: `url(${bgImage.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <Card className="w-full max-w-md bg-card text-card-foreground">
                <CardHeader>
                    <div className="flex items-center text-blue-800 justify-center mb-6 font-bold text-2xl leading-6 tracking-wider">
                        <h1>Global Academy of Technology</h1>
                    </div>
                    <div className="flex items-center justify-between pb-0">
                        <Image
                            src="/images/college-logo.png"
                            alt="College Logo"
                            width={85}
                            height={80}
                            priority
                            className="object-contain"
                        />
                        <Image
                            src={interactLogo}
                            alt="College Logo"
                            width={170}
                            height={90}
                            priority
                            className="object-contain relative left-4"
                        />
                        <Image
                            src={vtulogo}
                            alt="College Logo"
                            width={120}
                            height={120}
                            priority
                            className="object-contain"
                        />
                    </div>
                    <CardTitle className="text-2xl text-center font-bold text-foreground">
                        Login
                    </CardTitle>
                    <CardDescription className="text-center text-muted-foreground">
                        Use your registered email-id and password.
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
                                        <FormLabel className="text-foreground">
                                            Registered Email ID
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background border-input"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground">
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-background border-input"
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-destructive" />
                                    </FormItem>
                                )}
                            />
                            {error && (
                                <div className="text-sm text-destructive text-center">
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
                            className="w-full -mt-4 text-primary hover:text-primary/90"
                            onClick={() => router.push("/auth/forgotpassword")}
                        >
                            Forgot Password?
                        </Button>
                    </div>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Not yet Registered?
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full border-border hover:bg-secondary"
                        onClick={() => router.push("/auth/signup")}
                    >
                        Sign Up
                    </Button>
                    <Link className="w-full" href="/link/to/how/to/register">
                        <Button className="w-full" variant="outline">
                            Link for registration instructions
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
