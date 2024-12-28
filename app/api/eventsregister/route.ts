import { registerUserEvents } from "@/app/prismaClient/queryFunction";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { z } from "zod";

export interface EventCreate{
    eventNo : number,
    eventName : string,
    maxAccompanist : number,
    maxParticipant : number,
    category : string
}

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret"
);

const EventSchema = z.array(z.object({
    eventNo : z.number({message:"eventNo is required"}),
    eventName : z.string({message:"eventName is required"}),
    maxAccompanist : z.number({message:"max registrant is required"}),
    maxParticipant : z.number({message:"max participant is required"}),
    category : z.string({message : "category of event is required"})
}));

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

    if (!eventData.events || eventData.events.length===0) {
        return NextResponse.json(
            { success: false, message: "No events selected" },
            { status: 400 }
        );
    }

    const result = EventSchema.safeParse(eventData.events);

    if(!result.success){
        return NextResponse.json({success:false,message:result.error.message},{status:400});
    }

    const userId: string = verify.payload.id as string;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const userEvents = await registerUserEvents(userId, result.data);
        return NextResponse.json({ success: true, message : "events are registered " }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err }, { status: 400 });
    }
}

