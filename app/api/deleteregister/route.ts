import { deleteRegistrant, getUser } from "@/app/prismaClient/queryFunction";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
export async function DELETE(request : Request){
   
    const body = await request.json();
    const token : string = (await cookies()).get('auth_token')?.value as string;
    if(!token){
        return NextResponse.json({success:false,message:"token not found"},{status:401});
    }
    
    const verify = await jwtVerify(token,JWT_SECRET);
    if(!verify){
        return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
    }

    const userId :string = verify.payload.id as string;

    const user = await getUser(userId);

    if(!user){
        return  NextResponse.json({success:false,message:"User not found"},{status:404});
    }

    const { registrantId } = body;

    if(!registrantId){
        return NextResponse.json({success:false,message:"Registrant not found"},{status:404});
    }

    if(!user.registrants.includes(registrantId)){
        return NextResponse.json({success:false,message:"Registrant not found"},{status:404});
    }

    
    const userEvents = await deleteRegistrant(registrantId);

    return new Response(JSON.stringify({success:true,userEvents}),{status:200});

}