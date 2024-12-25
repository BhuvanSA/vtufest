import { registerUserEvents } from "@/app/prismaClient/queryFunction";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret"
);

export async function POST(request: Request) {
    const { events } = await request.json();

    if (events.length === 0 || !events) {
        return NextResponse.json(
            { success: false, message: "No events selected" },
            { status: 400 }
        );
    }

    const token: string = (await cookies()).get("auth_token")?.value as string;
    if (!token) {
        return NextResponse.json(
            { success: false, message: "token not found" },
            { status: 401 }
        );
    }

    const verify = await jwtVerify(token, JWT_SECRET);
    if (!verify) {
        return NextResponse.json(
            { success: false, message: "unauthorized" },
            { status: 401 }
        );
    }
    const eventData = JSON.parse(events);

    if (!eventData.events) {
        return NextResponse.json(
            { success: false, message: "No events selected" },
            { status: 400 }
        );
    }

    const userId: string = verify.payload.id as string;
    try {
        const userEvents = await registerUserEvents(userId, eventData.events);
        return NextResponse.json({ success: true, message : "events are registered " }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err }, { status: 400 });
    }
}
