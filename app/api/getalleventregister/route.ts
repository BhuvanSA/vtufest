import { getAllEventsByUser } from "@/app/prismaClient/queryFunction";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
export async function GET(request: Request) {

    const token:string = (await cookies()).get('auth_token')?.value as string;

    if (!token) {
        return NextResponse.json({ success: false, message: 'token not found' }, { status: 401 })
    }

    const verify = await jwtVerify(token, JWT_SECRET);

    if (!verify) {
        return NextResponse.json({ success: false, message: 'unauthorized' }, { status: 401 })
    }

    const userId:string = verify.payload.id as string;

    try {
        const userEvents = await getAllEventsByUser(userId);
        return NextResponse.json({ success: true, userEvents }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ success: false, message: err }, { status: 400 })
    }
}