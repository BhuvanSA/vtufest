import { deleteEventOfRegistrant } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function DELETE(request:Request){

    const {eventId} = await request.json();

    if(!eventId){
        return NextResponse.json({success:false,message:"Event Deleted"},{status:400});
    }
    
    try{
        const deleteEvent = await deleteEventOfRegistrant(eventId);
        return NextResponse.json({success:true,message:"event deleted"},{status:200});
    }
    catch(err){
        return NextResponse.json({success:false,message:err},{status:400});
    }
}