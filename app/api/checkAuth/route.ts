import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function GET(request: NextRequest) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Not authenticated" },
            { status: 401 }
        );
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.json({ success: true, message: "Authenticated" });
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid or expired token" },
            { status: 401 }
        );
    }
}
