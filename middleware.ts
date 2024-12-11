import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import Redis from "ioredis";

// Redis configuration
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// JWT secret
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60; // Time window in seconds
const RATE_LIMIT_MAX = 10;    // Maximum requests allowed per window

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract IP address
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // From proxy
    request.headers.get("cf-connecting-ip") ||                      // Cloudflare
    request.headers.get("x-real-ip") ||                             // Some proxies
    "unknown";

  const redisKey = `rate-limit:${ip}:${pathname}`;

  // Rate-limiting logic
  const current = await redis.incr(redisKey);
  if (current === 1) {
    // Set expiration for the key if it’s the first request
    await redis.expire(redisKey, RATE_LIMIT_WINDOW);
  }

  if (current > RATE_LIMIT_MAX) {
    return NextResponse.json(
      { success: false, message: "Too many requests, please try again later." },
      { status: 429 }
    );
  }

  // JWT authentication for specific routes
  if (pathname === "/api/register" || pathname === "/api/getallregister") {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    try {
      // Verify the JWT token using `jose`
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/register", "/api/getallregister","/api/logout"], // Specify routes for middleware
};
