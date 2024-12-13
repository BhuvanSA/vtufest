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
    
    console.log(registrant.events);

    const event_idfilter = registrant.events.filter((value)=> value.eventNo===eventId);
    console.log("fadsfss",event_idfilter)
    if(event_idfilter.length==0){
         return NextResponse.json({success:false,message:"no event found"},{status:404});
    }
    try{
     await updateRegistrant(usn,event_idfilter[0].id);
    return NextResponse.json({success:true, message:"marked attended"},{status:200});
    }
    catch(error){
        return NextResponse.json({success:false,error},{status:400});
    }
   
}