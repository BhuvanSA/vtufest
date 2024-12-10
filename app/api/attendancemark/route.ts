import { getRegistrant, updateRegistrant } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    
    const req = await request.json();
    const eventId = req.eventId;
    const usn = req.usn;

    const registrant = await getRegistrant(usn);

    if(!registrant){
        return NextResponse.json({success:false,error:"registrant not found"},{status:404});
    }

    if(registrant.events.filter((value)=> value.id==eventId).length==0){
        return NextResponse.json({success:false,error:"event not found"},{status:404});
    }

    try{
    const updatedRegistrant = await updateRegistrant(usn,eventId);
    }
    catch(error){
        console.log(error);
        return NextResponse.json({success:false,error},{status:500});
    }

    return NextResponse.json({success:true, message:"marked attended"},{status:200});
    
}