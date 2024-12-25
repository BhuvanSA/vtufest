import { getRegistrant, getRegistrantById } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function POST(request : Request){
    
    const {registrantId} = await request.json();   

    if(!registrantId){
        return NextResponse.json({success:false,message :"invalid registrant Id "}, {status:400});
    }

    try{
    const registrant = await getRegistrantById(registrantId);
        return NextResponse.json({success:true,registrant},{status:200})
    }
    catch(err){
        return NextResponse.json({success:false,message:"unable to fetch details"},{status:400});
    }
}