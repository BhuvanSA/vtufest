import { updateRegisterDetails } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function PATCH(request : Request){

    const data = await request.json();

    try{
    const updateDetails = await updateRegisterDetails(data);

    return NextResponse.json({success:true,message:"updated"},{status:200});
    }
    catch(err){
        return NextResponse.json({success:false,message:err},{status:400})
    }

}