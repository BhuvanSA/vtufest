import { AddEvent } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function POST(request : Request){
    const {registrantId,event,type} = await request.json();

    console.log(registrantId,event,type)
    if(!registrantId || !event || !type){
        return NextResponse.json({success:false,message:"invalid input "},{status:400});
    }

    try{
        const addEvent = await AddEvent(registrantId,event,type);
        return NextResponse.json({success:true,message:"event added"},{status:200});
    }
    catch(err){
        return NextResponse.json({success:false,message:err},{status:400});
    }
}