import { deleteSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await deleteSession();
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
    return NextResponse.redirect(new URL("/auth/sigin", request.nextUrl));
}
