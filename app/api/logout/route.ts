import { NextResponse } from "next/server";

export async function POST() {
    
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  
    response.cookies.set("auth_token", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
  
    return response;
  }
  