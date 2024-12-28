import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { Redis } from "@upstash/redis"; // Use Upstash Redis

const redis = Redis.fromEnv(); // Upstash Redis, reads credentials from environment variables

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

const GLOBAL_RATE_LIMIT_WINDOW = 60; // Time window in seconds
const GLOBAL_RATE_LIMIT_MAX = 100; // Maximum requests allowed per window

const OTP_RATE_LIMIT_WINDOW = 60; // Time window in seconds for OTP
const OTP_RATE_LIMIT_MAX = 5; // Maximum OTP requests per window

const protectedRoutes: string[] = [
    "/api/register",
    "/api/getallregister",
    "/api/eventsregister",
];
// what sholuld be the type for protectedPages
const protectedPages: string[] = [
    "/getallregister",
    "/register",
    "/getregister",
    "/eventregister",
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Extract IP address
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-real-ip") ||
        "unknown";

    // Apply OTP-specific rate limiting
    if (pathname === "/api/sendOtp") {
        const otpRedisKey = `otp-rate-limit:${ip}`;
        const currentOtpRequests = await redis.incr(otpRedisKey);
        if (currentOtpRequests === 1) {
            await redis.expire(otpRedisKey, OTP_RATE_LIMIT_WINDOW);
        }

        if (currentOtpRequests > OTP_RATE_LIMIT_MAX) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Too many OTP requests, please try again later.",
                },
                { status: 429 }
            );
        }
    }

    // Apply global rate limiting for all routes
    const globalRedisKey = `rate-limit:${ip}:${pathname}`;
    const currentGlobalRequests = await redis.incr(globalRedisKey);
    if (currentGlobalRequests === 1) {
        await redis.expire(globalRedisKey, GLOBAL_RATE_LIMIT_WINDOW);
    }

    if (currentGlobalRequests > GLOBAL_RATE_LIMIT_MAX) {
        return NextResponse.json(
            {
                success: false,
                message: "Too many requests, please try again later.",
            },
            { status: 429 }
        );
    }

    // Verify JWT for protected routes
    if (protectedRoutes.includes(pathname)) {
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        try {
            const verify = await jwtVerify(token, JWT_SECRET);
            console.log("json middleware", verify);

            if (!verify) {
                return NextResponse.json(
                    { success: false, message: "Unauthorized access" },
                    { status: 401 }
                );
            }

            return NextResponse.next();
        } catch (err) {
            console.error("Invalid or expired token:", err);
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }
    }

    // Redirect to login page for protected pages
    if (protectedPages.includes(pathname)) {
        const token = request.cookies.get("auth_token")?.value;

        if (!token) {
            return NextResponse.redirect(new URL("/auth", request.url));
        }

        try {
            const verify = await jwtVerify(token, JWT_SECRET);
            console.log("json middleware", verify);

            if (!verify) {
                return NextResponse.redirect(new URL("/auth", request.url));
            }

            return NextResponse.next();
        } catch (err) {
            console.error("Invalid or expired token:", err);
            return NextResponse.redirect(new URL("/auth", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/api/register",
        "/api/getallregister",
        "/api/sendEmailOtp",
        "/api/eventsregister",
        "/register",
        "/getregister",
        "/getallregister",
        "/eventregister",
    ],
};
