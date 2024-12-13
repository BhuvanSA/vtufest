import { registerUserEvents } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
    
    const {userId,events} = await request.json();
    console.log(userId,events)

    const userEvents = await registerUserEvents(userId,events);

    return NextResponse.json({success:true,userEvents},{status:200})
}