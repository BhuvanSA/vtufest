import { updateEventRole } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function PATCH(request:Request) {
    
    const body = await request.json();
    console.log(body);

    const {type,eventId} = body;

    if(!eventId || !type ){
        return NextResponse.json({success:false,
            message:"either id or Type or registrantId is not sent"
        },{status:400});
    }
    
    try{
        const updateRole = await updateEventRole(eventId,type);
        return NextResponse.json({success:true,message:"event Updated"},{status:200})
    }catch(err){
        return NextResponse.json({success:false,message:err},{status:400});
    }
}