import { decrypt } from "@/lib/session";
import { register } from "module";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req:Request) {
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    // verify the jwt
    if (!session) {
        return NextResponse.json(
            { success: false, message: "unauthorized" },
            { status: 401 }
        );
    }
    const userId: string = session.id as string;
    // get all the registerants with the userId of the signup

    const {collegeName} = await req.json();

    try{
        const registerList = await getRegisterByCollegeName(collegeName as string);
        NextResponse.json({success:true,registerList},{status:200});
    }
    catch (err) {
        return NextResponse.json(
            { success: false, message: err },
            { status: 500 }
        );
    }
}

