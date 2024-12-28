import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Redis } from "@upstash/redis";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize Upstash Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

// Define Zod schema for validation
const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
    newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password should not exceed 100 characters"),
});

// Function to verify OTP internally
// async function verifyOtp(email: string, otp: string): Promise<boolean> {
//     try {
//         const storedOtp = await redis.get<string>(`otp:${email}`);

//         if (!storedOtp) {
//             return false; // OTP expired or not found
//         }

//         if (storedOtp !== otp) {
//             return false; // Invalid OTP
//         }

//         // OTP is valid, delete it from Redis
//         await redis.del(`otp:${email}`);
//         return true;
//     } catch (error) {
//         console.error("Error verifying OTP:", error);
//         return false;
//     }
// }
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


export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input with Zod schema
        const validation = resetPasswordSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, errors: validation.error.errors },
                { status: 400 }
            );
        }

        const { email, otp, newPassword } = validation.data;

        // Verify OTP
        const isOtpValid = await verifyOtp(email, otp);
        if (!isOtpValid) {
            return NextResponse.json(
                { success: false, error: "Invalid or expired OTP" },
                { status: 401 }
            );
        }

        // Check if the user exists
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 13);

        // Update the user's password in the database
        const updatedUser = await prisma.users.update({
            where: { email },
            data: { password: hashedPassword },
        });

        // Return success response
        return NextResponse.json(
            {
                success: true,
                message: "Password reset successful",
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error resetting password:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
