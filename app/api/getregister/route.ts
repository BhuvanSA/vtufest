import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){


    const token = (await cookies()).get("token")?.value
    console.log(token);
    // token is by jwt which has userId
    
    // verify the jwt or middleware


    // get all the registerants with the userId of the signup

    // return the result

    return NextResponse.json({success:true});
    // use effect on the post must be made so that we can fetch the jwt 
}