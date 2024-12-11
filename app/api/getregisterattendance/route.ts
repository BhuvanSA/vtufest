
import { getRegistrant, getRegistrantByPhone } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function POST(request : Request){

    const req = await request.json();
   let flag = false;

    let id = null;
    if(!req.usn && !req.phone){
        return NextResponse.json({success:false,error:"usn and phone cannot be empty"},{status:404});
    }
    else if(!req.usn){
        id = req.phone;
    }
    else{
        flag = true;
        id = req.usn;
    }

    if(!id){
        return NextResponse.json({success:false,error:"internal server error"},{status:500});
    }

    console.log(id);

    if(flag == true){
        const registrant = await getRegistrant(id);

        return NextResponse.json({success:true,registrant},{status:200});
    }
    else{
        const registrant = await getRegistrantByPhone(id);
        return NextResponse.json({success:true,registrant},{status:200});
    }
}
