import { NextResponse } from "next/server";
import { z } from "zod";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string, // Upstash Redis URL
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string, // Upstash Redis Token
});

// Zod schema for validation
const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"), // Expecting a 6-digit OTP as a string
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = verifyOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.errors }, { status: 400 });
    }

    const { email, otp } = validation.data;

    // Retrieve OTP from Redis
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
      return NextResponse.json(
        { success: false, message: "OTP has expired or is invalid" },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedOtp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // OTP verification successful, delete OTP from Redis
    await redis.del(`otp:${email}`);

    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
