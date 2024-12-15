import { getAllEventsByUser } from "@/app/prismaClient/queryFunction";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
export async function POST(request:Request) {

    const token = (await cookies()).get('auth_token')?.value;
    console.log(token);

    const verify = await jwtVerify(token,JWT_SECRET);
        
    const userId = verify.payload.id;
   
    const userEvents = await getAllEventsByUser(userId);

    return NextResponse.json({success:true,userEvents},{status:200})
}