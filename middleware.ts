import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;


  // add the path name for the register later on
  if (pathname=='/api/register'|| pathname== "/api/getallregister" || pathname=="/api/eventsregister") {
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
      console.log("json middle ware",verify)
      if(!verify){
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
  matcher: ["/api/register","/api/getallregister","/api/eventsregister"]
};
