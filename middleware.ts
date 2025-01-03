import { NextResponse, NextRequest } from "next/server";
import { verifySession } from "@/lib/session";
import { Redis } from "@upstash/redis"; // Use Upstash Redis

const redis = Redis.fromEnv(); // Upstash Redis, reads credentials from environment variables

const GLOBAL_RATE_LIMIT_WINDOW = 60; // Time window in seconds
const GLOBAL_RATE_LIMIT_MAX = 100; // Maximum requests allowed per window
const OTP_RATE_LIMIT_WINDOW = 60; // Time window in seconds for OTP
const OTP_RATE_LIMIT_MAX = 5; // Maximum OTP requests per window

const protectedRoutes: string[] = [
    "/api/register",
    "/api/getallregister",
    "/api/eventsregister",
    "/register",
    "/register/documentupload",
    "/register/eventregister",
    "/register/getallregister",
    "/register/getregister",
    "/register/updateregister",
];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Extract IP address
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("cf-connecting-ip") ||
        request.headers.get("x-real-ip") ||
        "unknown";

    // Apply OTP-specific rate limiting
    if (path === "/api/sendOtp") {
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
    const globalRedisKey = `rate-limit:${ip}:${path}`;
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

    const session = await verifySession();
    if (protectedRoutes.includes(path) && !session) {
        return NextResponse.redirect(new URL("/auth/signin", request.nextUrl));
    }

    if (session && !request.nextUrl.pathname.startsWith("/register")) {
        return NextResponse.redirect(new URL("/register", request.nextUrl));
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
        "/register/documentupload",
        "/register/eventregister",
        "/register/getallregister",
        "/register/getregister",
        "/register/updateregister",
    ],
};
