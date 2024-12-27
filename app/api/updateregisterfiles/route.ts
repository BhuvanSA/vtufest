import { updateFile } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";
import { z } from "zod";

const fileSchema = z
    .instanceof(File)
    .refine((file) => file.size <= 150 * 1024, {
        message: "File size should be less than 300KB",
    })
    .refine(
        (file) =>
            ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
        {
            message: "Invalid file type. Only JPEG, PNG, and PDF are allowed.",
        }
    );


export async function PATCH(request:Request){

    const formData = await request.formData();

    const registrantId:string =  formData.get('registrantId') as string;

    const file:File =  formData.get('file') as File;

    const field:string = formData.get('field') as string;

    const result = fileSchema.safeParse(file)

    if(!result.success){
        return NextResponse.json({success:false,message : result.error.errors},{status:400});
    }

    if(!registrantId || !file || !field){
        return NextResponse.json({success:false,message:"invalid input"},{status:400});
    }

    try{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updatefile = await updateFile(registrantId,file,field);
    return NextResponse.json({success:true,message:'file uploaded and updated'},{status:200});
    }
    catch(err){
        return NextResponse.json({success:false,message:err},{status:400});
    }

}   