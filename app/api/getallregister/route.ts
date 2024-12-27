import { getRegistrantsByCollege } from "@/app/prismaClient/queryFunction";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");


export async function GET() {


    const token: string = (await cookies()).get("auth_token")?.value as string;


    if (!token) {
        return NextResponse.json({ success: false, message: "token not found" }, { status: 401 });
    }

    // token is by jwt which has userId
    const verify = await jwtVerify(token, JWT_SECRET);

    // verify the jwt or middleware
    if (!verify) {
        return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 });
    }
    const userId: string = verify.payload.id as string;
    // get all the registerants with the userId of the signup

    // return the result
    try {
        const registrant = await getRegistrantsByCollege(userId);
        return NextResponse.json({ success: true, registrant }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err }, { status: 500 });
    }

    // use effect on the post must be made so that we can fetch the jwt 
}