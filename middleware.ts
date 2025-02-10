import { NextResponse, NextRequest } from "next/server";
import { verifySession } from "@/lib/session";
import { Redis } from "@upstash/redis"; // Use Upstash Redis
import arcjet, { shield } from "@arcjet/next"; // Import arcjet
const redis = Redis.fromEnv(); // Upstash Redis, reads credentials from environment variables

const aj = arcjet({
    key: process.env.ARCJET_KEY!,
    rules: [
      // Shield protects your app from common attacks
      shield({
        mode: "LIVE", // Change to "LIVE" in production
      }),
    ],
  });

const GLOBAL_RATE_LIMIT_WINDOW = 60; // Time window in seconds
const GLOBAL_RATE_LIMIT_MAX = 100; // Maximum requests allowed per window
const OTP_RATE_LIMIT_WINDOW = 60; // Time window in seconds for OTP
const OTP_RATE_LIMIT_MAX = 5; // Maximum OTP requests per window

const protectedRoutes: string[] = [
    "/api/register",
    "/api/getallregister",
    "/api/eventsregister",
    "/api/getalleventregister",
    "/api/deleteeventregister",
    "/api/postdatetime",
    "/api/updateregisterdetails",
    "/api/updateregisterfiles",
    "/api/updateroleinevent",
    "/api/deleteregistrantevent",
    "/api/addeventregister",
    "/register",
    "/register/documentupload",
    "/register/eventregister",
    "/register/getallregister",
    "/register/getregister",
    "/register/updateregister",
    "/api/getPaymentInfo"
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

     // Apply arcjet protection for security
     const decision = await aj.protect(request);
     for (const result of decision.results) {
         console.log("Rule Result", result);
     }
 
     console.log("Conclusion", decision.conclusion);
 
     if (decision.isDenied() && decision.reason.isShield()) {
         return NextResponse.json(
             {
                 error: "You are suspicious!",
                 // Useful for debugging, but don't return it to the client in production
                 // reason: decision.reason,
             },
             { status: 403 },
         );
     }

    const session = await verifySession();
    
    if (protectedRoutes.includes(path) && !session?.id) {
        return NextResponse.redirect(new URL("/auth/signin", request.nextUrl));
    }
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
