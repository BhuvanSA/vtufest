import { NextResponse } from "next/server";
import { markVerified } from "../../prismaClient/queryFunction";


export async function POST(request : Request){
    
    const {usn} = await request.json();

    try{
    const updatedRegistrant = await markVerified(usn);
    }
    catch(error){
        return NextResponse.json({success:false,error},{status:500});
    }
    return NextResponse.json({success:true,message:"registrant verified"},{status:200});
    
}