import { getAllEventsByUser } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function POST(request:Request) {

    const {userId} = await request.json();
   
    const userEvents = await getAllEventsByUser(userId);

    return NextResponse.json({success:true,userEvents},{status:200})
}