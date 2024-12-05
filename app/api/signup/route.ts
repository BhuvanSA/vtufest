import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
//import { sendSMS } from "./twilio"; // Mock function for sending SMS, replace with actual implementation.

const prisma = new PrismaClient();

// Define Zod schema for validation
const collegeSchema = z.object({
  collegeName: z.string().min(1, "College name is required"),
  collegeCode: z.string().min(1, "College code is required"),
  phone: z.string().length(10, "Phone number must be exactly 10 digits"),
  userName: z.string().min(1, "Username is required"),
});

// Utility function to generate a random password
const generatePassword = (length: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input with safeParse
    const validation = collegeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, errors: validation.error.errors }, { status: 400 });
    }

    const { collegeName, collegeCode, phone, userName } = validation.data;

    // Check if the college code, userName, or phone already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { collegeCode },
          { userName },
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

/* SMS VERICATION PART   

    // Mock SMS sending for authentication
    const authCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit auth code
    await sendSMS(phone, `Your authentication code is: ${authCode}`);

    // Simulate successful authentication (replace with actual verification flow)
    const isAuthSuccessful = true; // Assume user enters the correct auth code.

    if (!isAuthSuccessful) {
      return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 401 });
    }

 */
    // Generate random passwords
    const password = generatePassword(8 + Math.floor(Math.random() * 5)); // 8-12 characters
    const adminPassword = generatePassword(8 + Math.floor(Math.random() * 5));

    // Hash the passwords
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    // Save user details to the Users table
    const newUser = await prisma.users.create({
      data: {
        collegeName,
        collegeCode,
        phone,
        userName,
        password: hashedPassword,
        adminPassword: hashedAdminPassword,
      },
    });

/* RESPONSE SMS PART
    // Send credentials back to the user's phone
    await sendSMS(
      phone,
      `Registration successful!\nUsername: ${userName}\nPassword: ${password}\nAdmin Password: ${adminPassword}`
    );
*/
    return NextResponse.json({ success: true, data: newUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}