import { getRegistrantCount, getUser, insertRegistrant } from "@/app/prismaClient/queryFunction";
import { utapi } from "@/utils/uploadthing";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const fileSchema = z.instanceof(File).refine((file) => file.size <= 150 * 1024, {
    message: "File size should be less than 300KB",
  }).refine((file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type), {
    message: "Invalid file type. Only JPEG, PNG, and PDF are allowed.",
  });

  const eventSchema = z.object({
    eventName: z.string().min(1, "Event name cannot be empty"),
    eventNo: z.number()
  });
  
  const registrantSchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    usn: z.string().min(1,"Usn cannot be empty"),
    type: z.enum(["PARTICIPANT","TEAMMANAGER","ACCOMPANIST"], "Invalid type"), 
    phone : z.string().min(10,"Invalid phone Number"),
    events: z.array(eventSchema), // Array of event objects
    photo: fileSchema, // File validation for photo
    aadhar: fileSchema, // File validation for Aadhar
    sslc: fileSchema, // File validation for SSLC
    puc: fileSchema, // File validation for PUC
    admission1: fileSchema, // File validation for admission
    admission2 : fileSchema,
    idcard: fileSchema, // File validation for ID card
  });
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");


export async function POST(request : Request){
    
    const formData = await request.formData();


    const dataEvent = JSON.parse(formData.get("events"));

    // zod validation 
    // add phone number and email
        const registrant = {
            name : formData.get("name"),
            usn : formData.get("usn"),
            type : formData.get("type"),
            events : dataEvent ,
            phone : formData.get("phone"),
            photo : formData.get("photo"),
            sslc : formData.get("sslc"),
            aadhar : formData.get("aadhar"),
            puc : formData.get("puc"),
            admission1 : formData.get('admission1'),
            admission2 : formData.get('admission2'),
            idcard : formData.get('idcard')
        }

        console.log("registrants",registrant)

        const result = registrantSchema.safeParse(registrant);
        console.log(result.error?.message)
        if (!result.success){
            return NextResponse.json({success: false, error : result.error},{status:400})
        }

    // check for jwt token
    
    //get the data from the jwt of the college and then map it to the registerant

    const token = (await cookies()).get('auth_token')?.value;
    console.log(token);

    const verify = await jwtVerify(token,JWT_SECRET);
        
    const userId = verify.payload.id;
    console.log("verify",verify);
    console.log("userId",userId)

    const user = await getUser(userId);
    console.log("user",user)

    const count = await getRegistrantCount(userId);

    console.log("count",count)
    // limit to the 45 registerants
    if(count>45){
        return NextResponse.json({success:false, message : "registrant limit exceeded"},{status:400});
    }


    //upload the files to the file uploader
    const files = [result.data.sslc,result.data.puc,result.data.admission1,result.data.idcard,result.data.photo,
        result.data.aadhar,result.data.admission2
    ]
    try{
    const response = await utapi.uploadFiles(files);
    const registrantDB = {
        name: result.data.name,
        usn : result.data.usn,
        type : result.data.type,
        events : result.data.events,
        phone : result.data.phone,
        photoUrl : response[4].data?.url,
        aadharUrl : response[5].data?.url,
        sslcUrl : response[0].data?.url,
        pucUrl : response[1].data?.url,
        admission1Url : response[2].data?.url,
        admission2Url : response[6].data?.url,
        idcardUrl :response[3].data?.url,
        userId : userId,
    }
    // // save the registrant into the DB
    const dataDB = await insertRegistrant(registrantDB);
    console.log("this is db api",dataDB);

    return NextResponse.json({success:true,message : "registered successful"},{status:200});
    }
    catch(error){
        return NextResponse.json({success: false,error:error},{status:400});
    }
    

    //get the response from the url and file uploader and then save the url to the database
    
    //save the registerants db
}

// id userId-relation(users)  name   usn     type    photo  paymentstatus  events(list)   aadhar 10thmarks 12marks addmission idcard 