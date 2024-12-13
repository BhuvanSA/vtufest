import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import axios from "axios";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define Zod schema for validation
const signupSchema = z.object({
  collegeName: z.string().min(1, "College name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().length(10, "Phone number must be exactly 10 digits"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"), // Validate OTP input
});

// Utility function to generate a random password
const generatePassword = (length: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// Function to send OTP
// const sendOtpRequest = async (email: string) => {
//   const response = await axios.post(
//     `${process.env.BASE_URL}/api/sendEmailOtp`,
//     { email },
//     {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// 
//   const data = response.data;
//   if (!data.success) {
//     throw new Error("Failed to send OTP");
//   }
//   return data.message;
// };

// Function to verify OTP
const verifyOtp = async (email: string, otp: string) => {
  const response = await axios.post(
    `http://localhost:3000/api/verifyOtp`,
    { email, otp },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = response.data;
  if (!data.success) {
    throw new Error("Invalid OTP");
  }
  return true;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input with Zod schema
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.errors }, { status: 400 });
    }

    const { collegeName, email, phone, otp } = validation.data;

    // Check if the user already exists in the database (by email, phone, or collegeName)
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { phone },
          { collegeName },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A user with the provided details already exists" },
        { status: 400 }
      );
    }

    // Verify OTP entered by the user
    const otpValid = await verifyOtp(email, otp);
    if (!otpValid) {
      return NextResponse.json({ success: false, error: "OTP validation failed" }, { status: 401 });
    }

    // Generate random password for the user
    const password = generatePassword(8 + Math.floor(Math.random() * 5)); // Length between 8-12
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    // Generate unique username
    

    // Create the user in the database
    const newUser = await prisma.users.create({
      data: {
        collegeName,
        email,
        phone,
        password: hashedPassword, // Store the hashed password 
      },
    });

    // Return successful response
    return NextResponse.json({ success: true, message: "Registration successful", user: newUser });
  } catch (error) {
    console.error("Error in registration process:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}