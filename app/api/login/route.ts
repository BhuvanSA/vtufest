import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);
const COOKIE_NAME: string = "auth_token";
const COOKIE_OPTIONS: object = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
};

// Updated Zod schema with custom error messages
const loginSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be less than 12 characters"),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password",
                    errors: result.error.errors.map((err) => ({
                        field: err.path[0],
                        message: "Invalid email or password",
                    })),
                },
                { status: 401 }
            );
        }

        const { email, password } = result.data;
        const user = await prisma.users.findUnique({
            where: { email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password"
                },
                { status: 401 }
            );
        }

        const token = await new SignJWT({ id: user.id, email: user.email })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(JWT_SECRET);


        const response = NextResponse.json({
            success: true,
            message: "Authentication successful",
        });

        response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
        return response;
    } catch (error) {
        console.error("Login failed:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Invalid email or password",
            },
            { status: 401 }
        );
    }
}
