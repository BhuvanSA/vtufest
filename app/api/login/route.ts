import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas/auth";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
    const JWT_TOKEN_EXPIRY = new Date(Date.now() + 60 * 60 * 1);

    try {
        const body = await request.json();

        // validate the request body
        const input = loginSchema.safeParse(body);
        if (!input.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password schema",
            });
        }
        // check db for user using email
        const db = await prisma.users.findUnique({
            where: {
                email: input.data.email,
            },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
            },
        });

        // verify the password
        if (!db || !(await bcrypt.compare(input.data.password, db.password))) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password provided",
            });
        }

        // create a stateless session
        const token = {
            id: db.id,
            email: db.email,
            role: db.role,
            expiresAt: JWT_TOKEN_EXPIRY,
        };
        await createSession(token);

        // all good return success
        return NextResponse.json({
            success: true,
            message: "Authentication successful",
        });

        // Unexpected error
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Server error try again later",
        });
    }
}
