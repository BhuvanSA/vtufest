import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Redis } from "@upstash/redis";
import nodemailer from "nodemailer";

// Initialize Upstash Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string, // Upstash Redis URL
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string, // Upstash Redis Token
});

// Define Zod schema for validation
const formSchema = z.object({
    college: z
        .string()
        .min(3, "College name must be at least 3 characters")
        .max(100, "College name should not exceed 100 characters"),
    phone: z
        .string()
        .regex(/^\d{10,15}$/, "Phone number must be between 10 to 15 digits"),
    email: z.string().email("Invalid email address"),
    otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});

// Utility function to generate a random password
const generatePassword = (length: number) => {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    return Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
};

// Function to verify OTP internally
async function verifyOtp(
    email: string,
    otp: string
): Promise<{ success: boolean; message: string }> {
    try {
        const storedOtp = await redis.get<string>(`otp:${email}`);

        // Debug Logs
        console.log(`Stored OTP for ${email}: ${storedOtp}`);
        console.log(`Received OTP for ${email}: ${otp}`);

        if (!storedOtp) {
            console.log("OTP has expired or does not exist.");
            return {
                success: false,
                message: "OTP has expired or does not exist.",
            };
        }

        if (storedOtp != otp) {
            console.log(
                "Invalid OTP provided. Stored OTP:",
                storedOtp,
                "Received OTP:",
                otp
            );
            return { success: false, message: "Invalid OTP provided." };
        }

        // OTP is valid, delete it from Redis
        try {
            await redis.del(`otp:${email}`);
        } catch (error: any) {
            console.error("Error deleting OTP from Redis:", error);
        }

        return { success: true, message: "OTP verified successfully." };
    } catch (error: any) {
        console.error("Error verifying OTP internally:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

// Function to send password via email
async function sendPasswordEmail(email: string, password: string) {
    try {
        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail", // Use your email provider
            auth: {
                user: process.env.EMAIL_USER as string, // Your email address
                pass: process.env.EMAIL_PASSWORD as string, // Your email password or app password
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender email address
            to: email, // Receiver email address
            subject: "Your Account Password",
            text: `Your account has been created successfully. Your password is: ${password}. Please change it after logging in.`,
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error: any) {
        console.error("Error sending password email:", error);
        // Optionally, handle email sending failures (e.g., delete the created user, retry, etc.)
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        // Validate input with Zod schema

        const validation = formSchema.safeParse(body);
        console.log(validation);
        if (validation.success === false) {
            return NextResponse.json(
                { success: false, errors: validation.error.errors },
                { status: 400 }
            );
        }
        const { college, email, phone, otp } = validation.data;

        // Check if the user already exists in the database (by email or phone)
        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [{ email }, { phone }],
            },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "User already exists" },
                { status: 400 }
            );
        }

        // Verify OTP entered by the user
        const otpValidation = await verifyOtp(email, otp);
        if (!otpValidation.success) {
            return NextResponse.json(
                { success: false, error: otpValidation.message },
                { status: 401 }
            );
        }

        // Generate random password for the user
        const password = generatePassword(8 + Math.floor(Math.random() * 5)); // Length between 8-12
        const hashedPassword = await bcrypt.hash(password, 13); // Hash the password

        // Create the user in the database
        const newUser = await prisma.users.create({
            data: {
                collegeName: college,
                email,
                phone,
                password: hashedPassword, // Store the hashed password
            },
        });

        if (newUser) {
            // Send password to user's email
            await sendPasswordEmail(email, password);
        }

        // Return successful response
        return NextResponse.json(
            {
                success: true,
                message: "Registration successful",
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    phone: newUser.phone,
                    collegeName: newUser.collegeName,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error in registration process:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
