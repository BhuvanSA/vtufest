import { updateFile } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function PATCH(request:Request){

    const formData = await request.formData();

    const registrantId:string=  formData.get('registrantId') as string;

    const file:File =  formData.get('file');

    const field:string =   formData.get('field');

    console.log(registrantId,file,field)

    if(!registrantId || !file || !field){
        return NextResponse.json({success:false,message:"invalid input"},{status:400});
    }
    try{
    const updatefile = await updateFile(registrantId,file,field);
    if(updatefile===true){
    return NextResponse.json({success:true,message:'file uploaded and updated'},{status:200});
    }
    else {
        return NextResponse.json({success:false,message:'error'},{status:400})
    }
    }
    catch(err){
        return NextResponse.json({success:false,message:err},{status:400});
    }

}   