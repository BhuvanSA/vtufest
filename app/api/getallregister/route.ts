import { getRegistrant, getRegistrantsByCollege } from "@/app/prismaClient/queryFunction";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");


export async function GET(){


    const token = (await cookies()).get("auth_token")?.value
    console.log(token);
    // token is by jwt which has userId
    const verify = await jwtVerify(token,JWT_SECRET);

    // verify the jwt or middleware
    if(!verify){
        return NextResponse.json({success:false, message : "unauthorized"})
    }
    const userId = verify.payload.id;
    // get all the registerants with the userId of the signup

    // return the result
    const registrant = await getRegistrantsByCollege({id:userId});
    console.log("the api registrant",registrant)
    
    return NextResponse.json({success:true,registrant});
    // use effect on the post must be made so that we can fetch the jwt 
}