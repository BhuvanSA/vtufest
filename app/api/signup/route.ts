import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import axios from "axios";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define Zod schema for validation
const formSchema = z.object({
  college: z
    .string()
    .min(1, "College name is required")
    .max(100, "College name should not exceed 100 characters"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be a 10-digit number"),
  email: z.string().email("Invalid email address"),
  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be a 6-digit number")
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
async function verifyOtp(email :string, otp:string ) {
  try {
    const response = await axios.post("http://localhost:3000/api/verifyOtp", {
      email: email,
      otp: otp,
    });
  
    if (response.data.success) {
      console.log("OTP verified successfully:", response.data.message);
      return true;
    } else {
      console.log("Error:", response.data.message);
    }
  } catch (error : any) {
    if (error.response) {
      // Server responded with a status code other than 2xx
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // Request was sent but no response was received
      console.error("No Response:", error.request);
    } else {
      // Something else caused the error
      console.error("Error:", error.message);
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Validate input with Zod schema
    const validation = formSchema.safeParse(body);
    console.log(validation)
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.errors }, { status: 400 });
    }
    const { college, email, phone, otp } = validation.data;
    // Check if the user already exists in the database (by email, phone, or college)
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { phone }
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
    const otpValid : any = await verifyOtp(email, otp);
    if (!otpValid) {
      return NextResponse.json({ success: false, error: "OTP validation failed" }, { status: 401 });
    }

    // Generate random password for the user
    const password = generatePassword(8 + Math.floor(Math.random() * 5)); // Length between 8-12
    const hashedPassword = await bcrypt.hash(password, 13); // Hash the password
    
    const collegeName = college;
    // Create the user in the database
    const newUser = await prisma.users.create({
      data: {
        collegeName,
        email,
        phone,
        password: hashedPassword, // Store the hashed password 
      },
    });

    if(newUser){
      const response = await axios.post("http://localhost:3000/api/sendpassword",{
        email,
        password
      }) 
    }
    // Return successful response
    return NextResponse.json({ success: true, message: "Registration successful", user: newUser });
  } catch (error) {
    console.error("Error in registration process:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}