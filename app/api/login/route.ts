import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
// JWT secret key
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);
const COOKIE_NAME: string = "auth_token";
const COOKIE_OPTIONS: object = {
  httpOnly: true, // Prevent access via JavaScript
  secure: process.env.NODE_ENV === "production", // Use HTTPS in production
  sameSite: "strict", // Prevent CSRF attacks
  path: "/", // Cookie accessible site-wide
  // Expiration
};

// Zod schema for login validation
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must be less than 50 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(12, "Password must be less than 12 characters"),
});

// POST handler
export async function POST(request: Request) {
  try {
    // Parse the JSON request body
    const body = await request.json();

    const {email,password} = body;

    // Validate using safeParse
    // const result = loginSchema.safeParse(body);

    // if (!result.success) {
    //   // If validation fails, return the error messages
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Validation error",
    //       errors: result.error.errors.map((err) => ({
    //         path: err.path,
    //         message: err.message,
    //       })),
    //     },
    //     { status: 400 }
    //   );
    // }

    // // Destructure validated data
    // const { username, password } = result.data;

    // Fetch user from the database
    const user = await prisma.users.findUnique({
      where: { email: email },
    });

    // If user does not exist, return error
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate JWT token using jose
    const token = await new SignJWT({ id: user.id, username: user.userName })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h") // Set expiration time
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
    });

    response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}