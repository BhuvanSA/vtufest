"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
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
import { useAuthContext } from "@/contexts/auth-context";
import { loginSchema } from "@/lib/schemas/auth";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

// Import your logos and background image
import gatLogo from "@/public/images/gat-logo.png";
import vtulogo from "@/public/images/vtulogo.png";
import bgImage from "@/public/images/GAT IMAGE.png";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setIsLoggedIn } = useAuthContext();
  const [visibility, setVisibility] = useState<boolean>(false);

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
      className="relative min-h-screen flex items-center justify-center p-10"
      style={{ backgroundColor: "#FF0000" }}
    >
      {/* Background Image with reduced opacity */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('${bgImage.src}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      />

      {/* Content over the background */}
      <div className="relative z-10">
        <Card className="w-full max-w-md rounded-lg shadow-2xl overflow-hidden border-0 transition-shadow duration-300 hover:shadow-3xl">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-yellow-300 to-yellow-500 p-6 text-center">
            {/* Logos placed above the title */}
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="transition-transform duration-300 hover:scale-105">
                <Image
                  src={gatLogo}
                  alt="GAT Logo"
                  width={100}
                  height={100}
                  style={{ objectFit: "contain" }}
                  className="drop-shadow-lg"
                />
              </div>
              <div className="transition-transform duration-300 hover:scale-105">
                <Image
                  src={vtulogo}
                  alt="VTU Logo"
                  width={100}
                  height={100}
                  style={{ objectFit: "contain" }}
                  className="drop-shadow-lg"
                />
              </div>
            </div>
            {/* INTERACT Title */}
            <div className="transition-transform duration-300 hover:scale-105">
              <CardTitle className="text-6xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-red-600 via-[#800000] to-red-900 bg-clip-text text-transparent drop-shadow-lg">
                INTERACT
              </CardTitle>
            </div>
            <CardDescription className="mt-4 text-4xl font-extrabold text-[#1e3a8a] uppercase tracking-wide drop-shadow-lg animate-bounce">
              24
              <sub className="text-lg align-top font-semibold text-[#1e3a8a]">
                th
              </sub>{" "}
              VTU YOUTH FEST
            </CardDescription>
          </CardHeader>

          {/* Form content */}
          <CardContent className="bg-[#990000] p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-300 font-bold">
                        Registered Email ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-gray-200 border-gray-400 focus:border-yellow-400 text-gray-900 focus:ring-2 focus:ring-yellow-400"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-yellow-300 font-bold">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="bg-gray-200 border-black-400 focus:border-yellow-400 pr-10 text-gray-900 focus:ring-2 focus:ring-yellow-400"
                            type={visibility ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setVisibility((prev) => !prev)}
                            className="absolute right-2 top-2.5 text-gray-600 hover:text-gray-800"
                          >
                            {visibility ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                {error && (
                  <div className="text-sm text-red-400 text-center">{error}</div>
                )}
                <LoadingButton
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-yellow-300 hover:bg-yellow-450 text-[#1f1f1f] font-bold transition-transform duration-300 hover:scale-105"
                >
                  Log in
                </LoadingButton>
              </form>
            </Form>
          </CardContent>

          {/* Footer */}
          <CardFooter className="bg-[#990000] p-4 flex flex-col gap-6">
            <Button
              variant="link"
              className="w-full text-yellow-300 hover:text-yellow-400 transition-colors duration-300"
              onClick={() => router.push("/auth/forgotpassword")}
            >
              Forgot Password?
            </Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-yellow-400" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#990000] px-2 text-yellow-300">
                  Not yet Registered?
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full bg-yellow-300 text-black-300 hover:bg-yellow-400 hover:text-[#990000] transition-colors duration-300"
              onClick={() => router.push("/auth/signup")}
            >
              Sign Up
            </Button>
            <Link className="w-full" href="/link/to/how/to/register">
              <Button
                variant="outline"
                className="w-full bg-yellow-300 text-black-300 hover:bg-yellow-400 hover:text-[#990000] transition-colors duration-300"
              >
                Registration Instructions
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
