import { verifySession } from "@/lib/session";
import { NextResponse, type NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function GET(request: NextRequest) {
    const token = verifySession();

    if (!token) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated",
        });
    }

    return NextResponse.json({ success: true, message: "Authenticated" });
}
