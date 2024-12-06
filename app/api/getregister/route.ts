import { getRegistrant } from "@/app/prismaClient/queryFunction";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){


    const token = (await cookies()).get("token")?.value
    console.log(token);
    // token is by jwt which has userId
    
    // verify the jwt or middleware


    // get all the registerants with the userId of the signup

    // return the result
    const registrant = await getRegistrant({usn : "1GA21IS0066"});
    console.log("the api registrant",registrant)
    
    return NextResponse.json({success:true,registrant});
    // use effect on the post must be made so that we can fetch the jwt 
}