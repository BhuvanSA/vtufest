import { getRegistrantCount, getUser, insertRegistrant } from "@/app/prismaClient/queryFunction";
import { utapi } from "@/utils/uploadthing";
import { NextResponse } from "next/server";
import { z } from "zod";

const fileSchema = z.instanceof(File).refine((file) => file.size <= 150 * 1024, {
    message: "File size should be less than 300KB",
  }).refine((file) => ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type), {
    message: "Invalid file type. Only JPEG, PNG, and PDF are allowed.",
  });

  const eventSchema = z.object({
    name: z.string().min(1, "Event name cannot be empty"),
    attended: z.boolean().default(false)
  });
  
  const registrantSchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    usn: z.string().min(1,"Usn cannot be empty"),
    type: z.enum(["PARTICIPANT","TEAMMANAGER","ACCOMPANIST"], "Invalid type"), // Add more enums if needed
    events: z.array(eventSchema), // Array of event objects
    photo: fileSchema, // File validation for photo
    aadhar: fileSchema, // File validation for Aadhar
    sslc: fileSchema, // File validation for SSLC
    puc: fileSchema, // File validation for PUC
    admission: fileSchema, // File validation for admission
    idcard: fileSchema, // File validation for ID card
  });


export async function POST(request : Request){
    
    const formData = await request.formData();

    const data = JSON.parse(formData.get("data"));

    

    // zod validation 
   
        const registrant = {
            name : data.name,
            usn : data.usn,
            type : data.type,
            events : data.events ,
            photo : formData.get("photo"),
            sslc : formData.get("sslc"),
            aadhar : formData.get("aadhar"),
            puc : formData.get("puc"),
            admission : formData.get('admission'),
            idcard : formData.get('idcard')
        }

        console.log(registrant)

        const result = registrantSchema.safeParse(registrant);
        if (!result.success){
            return NextResponse.json({success: false, error : result.error})
        }
    

    // jpg - (idcard) and (passport photo)
    // pdf - (10 and 12 marks card) and (admission to BE) and (aadhar card)


    // check all the data exists
    

    // check for jwt token
    
    //get the data from the jwt of the college and then map it to the registerant

    // static kept for now
    const user = await getUser("1");
    console.log("user",user)

    const count = await getRegistrantCount("1");

    console.log("count",count)
    // limit to the 45 registerants
    if(count>45){
        return NextResponse.json({success:false, message : "registrant limit exceeded"});
    }


    //upload the files to the file uploader
    const files = [result.data.sslc,result.data.puc,result.data.admission,result.data.idcard,result.data.photo,
        result.data.aadhar
    ]
    try{
    const response = await utapi.uploadFiles(files);
    const registrantDB = {
        name: result.data.name,
        usn : result.data.usn,
        type : result.data.type,
        events : result.data.events,
        photoUrl : response[4].data?.url,
        aadharUrl : response[5].data?.url,
        sslcUrl : response[0].data?.url,
        pucUrl : response[1].data?.url,
        admissionUrl : response[2].data?.url,
        idcardUrl :response[3].data?.url,
        userId : "1",
    }
    // the userId is static for now
    const dataDB = await insertRegistrant(registrantDB);
    console.log("this is db api",dataDB);

    return NextResponse.json({success:true, registrantDB});
    }
    catch(error){
        return NextResponse.json({success: false,error:error});
    }
    

    //get the response from the url and file uploader and then save the url to the database
    
    //save the registerants db
}

// id userId-relation(users)  name   usn     type    photo  paymentstatus  events(list)   aadhar 10thmarks 12marks addmission idcard 