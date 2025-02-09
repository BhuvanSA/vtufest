import { saveDateTimeOfArrival } from "@/app/prismaClient/queryFunction";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request:Request) {
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

    const { dateOfArrival, timeOfArrival } = await request.json();
    console.log(dateOfArrival, timeOfArrival);
    // get all the registerants with the userId of the signup

    if(!dateOfArrival || !timeOfArrival){
        return NextResponse.json({success:false,message:"date /time is missing"},{status :404});
    }

    try{
        await saveDateTimeOfArrival(userId , dateOfArrival as string, timeOfArrival as string);
        return NextResponse.json({success:true, message : "saved successfully"},{status:200});
    }catch(error){
        return NextResponse.json({success:false,message:error},{status:400});
    }

}