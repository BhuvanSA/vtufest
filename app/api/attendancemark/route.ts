import { getRegistrant, updateRegistrant } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    
    const {usn,eventId} = await request.json();
    
    

    const registrant = await getRegistrant(usn);

    if(!registrant){
        return NextResponse.json({success:false,error:"registrant not found"},{status:404});
    }
    
    console.log(registrant.eventRegistrations);

    const eventFilter = registrant.eventRegistrations.find(x => x.eventId === eventId);
    console.log("eventFIlter",eventFilter)
    if(!eventFilter){
         return NextResponse.json({success:false,message:"no event found"},{status:404});
    }

    try{
    const res = await updateRegistrant(usn,eventFilter.id);
    return NextResponse.json({success:true, message:`marked attendence ${res}`},{status:200});
    }
    catch(error){
        return NextResponse.json({success:false,error},{status:400});
    }
   
}