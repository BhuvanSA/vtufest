import { verifySession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    const token = verifySession();
    if (!token) {
        return NextResponse.json({
            success: false,
            message: "Not authenticated",
        });
    }
    return NextResponse.json({ success: true, message: "Authenticated" });
}
