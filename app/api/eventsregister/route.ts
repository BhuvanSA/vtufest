import { registerUserEvents } from "@/app/prismaClient/queryFunction";
// import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { EventSchema } from "@/lib/schemas/register";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

export interface EventCreate {
    eventNo: number;
    eventName: string;
    maxAccompanist: number;
    maxParticipant: number;
    category: string;
}

export async function POST(request: Request) {
    const session = await verifySession();
    if (!session) {
        redirect("/auth/signin");
    }
    const { events } = await request.json();

    if (events.length === 0 || !events) {
        return NextResponse.json(
            { success: false, message: "No events selected" },
            { status: 400 }
        );
    }

    const eventData = JSON.parse(events);

    if (!eventData.events || eventData.events.length === 0) {
        return NextResponse.json(
            { success: false, message: "No events selected" },
            { status: 400 }
        );
    }

    const result = EventSchema.safeParse(eventData.events);

    if (!result.success) {
        return NextResponse.json(
            { success: false, message: result.error.message },
            { status: 400 }
        );
    }

    const userId: string = session.id as string;
    try {
        // console.log(userId, result.data);
        await registerUserEvents(userId, result.data);
        return NextResponse.json(
            { success: true, message: "events are registered " },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err },
            { status: 400 }
        );
    }
}
