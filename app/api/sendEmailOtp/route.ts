import { NextResponse } from "next/server";
import { z } from "zod";
import Redis from "ioredis";
import nodemailer from "nodemailer";

// Redis configuration
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Zod schema for validation
const emailOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Utility to generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = emailOtpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.errors }, { status: 400 });
    }

    const { email } = validation.data;

    // Rate limiting logic
    const redisKey = `email-otp-rate-limit:${email}`;
    const currentOtpRequests = await redis.incr(redisKey);
    if (currentOtpRequests === 1) {
      // Set expiration for the key if it's the first request
      await redis.expire(redisKey, 60); // 60 seconds window
    }
    if (currentOtpRequests > 5) {
      return NextResponse.json(
        { success: false, message: "Too many OTP requests, please try again later." },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOtp();

    // Save OTP to Redis
    await redis.set(`otp:${email}`, otp, "EX", 300); // OTP valid for 5 minutes

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email provider (e.g., Gmail, Sendinblue, Outlook)
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address
      to: email, // Receiver email address
      subject: "Your OTP for Verification",
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
