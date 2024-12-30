import { NextResponse } from "next/server";
import { loginUser } from "@/app/prismaClient/queryFunction";

const COOKIE_NAME: string = "auth_token";
const COOKIE_OPTIONS: object = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token } = await loginUser(body.email, body.password);

        const response = NextResponse.json({
            success: true,
            message: "Authentication successful",
        });

        response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
        return response;
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Invalid email or password",
            },
            { status: 401 }
        );
    }
}
