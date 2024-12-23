import { getUser, insertRegistrant } from "@/app/prismaClient/queryFunction";
import { utapi } from "@/utils/uploadthing";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";
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

const eventSchema = z.object({
    eventName: z.string().min(1, "Event name cannot be empty"),
    eventNo: z.number(),
    type: z.enum(["PARTICIPANT", "ACCOMPANIST"], "Invalid type"),
});

const registrantSchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    usn: z.string().min(1, "Usn cannot be empty"),
    phone: z.string().min(10, "Invalid phone Number"),
    teamManager: z.boolean(),
    events: z.array(eventSchema), // Array of event objects
    photo: fileSchema, // File validation for photo
    aadhar: fileSchema, // File validation for Aadhar
    sslc: fileSchema, // File validation for SSLC
    puc: fileSchema, // File validation for PUC
    admission1: fileSchema, // File validation for admission
    admission2: fileSchema,
    idcard: fileSchema, // File validation for ID card
});

const TeamMangerRegistrantSchema = z.object({
    name: z.string().min(1, "Name cannot be empty"),
    usn: z.string().min(1, "Usn/Id Number cannot be empty"),
    phone: z.string().min(10, "Invalid phone Number"),
    teamManager: z.boolean(),
    photo: fileSchema, // File validation for photo
    idcard: fileSchema, // File validation for ID card
});

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret"
);

export async function POST(request: Request) {
    const formData = await request.formData();

    const events = formData.get("events");

    if (!events) {
        return NextResponse.json(
            { success: false, message: "Events data is missing" },
            { status: 400 }
        );
    }

    const dataEvent = JSON.parse(events as string);

    // zod validation
    // add phone number and email
    const registrant = {
        name: formData.get("name"),
        usn: formData.get("usn"),
        teamManager: formData.get("teamManager") === "true" ? true : false,
        events: dataEvent,
        phone: formData.get("phone"),
        photo: formData.get("photo"),
        sslc: formData.get("sslc"),
        aadhar: formData.get("aadhar"),
        puc: formData.get("puc"),
        admission1: formData.get("admission1"),
        admission2: formData.get("admission2"),
        idcard: formData.get("idcard"),
    };

    console.log("registrants", registrant);

    // check for jwt token

    //get the data from the jwt of the college and then map it to the registerant

    const token = (await cookies()).get("auth_token")?.value;
    console.log(token);

    if (!token) {
        return NextResponse.json(
            { success: false, message: "Your are Unauthorized" },
            { status: 401 }
        );
    }

    const verify = await jwtVerify(token, JWT_SECRET);

    const userId: string = verify.payload.id as string;

    console.log("the user Id :" ,userId)

    const user = await getUser(userId);

    console.log("the user is :",user)

    if (!user) {
        return NextResponse.json(
            { success: false, message: "user not found" },
            { status: 400 }
        );
    }

    // limit to the 45 registerants
    if (user.registrants.length > 45) {
        return NextResponse.json(
            { success: false, message: "registrant limit exceeded" },
            { status: 400 }
        );
    }

    let result = null;

    if (registrant.teamManager === true) {
        result = TeamMangerRegistrantSchema.safeParse(registrant);
        console.log(result);
        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.error.message },
                { status: 400 }
            );
        }

        const files: File[] = [result.data.photo, result.data.idcard];
        try {
            const response = await utapi.uploadFiles(files);

            const registrantDB = {
                name: result.data.name,
                usn: result.data.usn,
                teamManager: result.data.teamManager,
                phone: result.data.phone,
                photoUrl: response[0].data?.url,
                idcardUrl: response[1].data?.url,
                userId: userId,
            };

            // save the registrant into the DB
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const dataDB = await insertRegistrant(registrantDB);

            return NextResponse.json(
                { success: true, message: "registered successful" },
                { status: 200 }
            );
        } catch (err) {
            return NextResponse.json({ success: false, error: err }, { status: 400 });
        }
    } 
    else {
        
        result = registrantSchema.safeParse(registrant);
        console.log(result.error?.message);
        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.error.message },
                { status: 400 }
            );
        }

        const files: File[] = [
            result.data.sslc,
            result.data.puc,
            result.data.admission1,
            result.data.idcard,
            result.data.photo,
            result.data.aadhar,
            result.data.admission2,
        ];
        try {
            const response = await utapi.uploadFiles(files);
            const registrantDB = {
                name: result.data.name,
                usn: result.data.usn,
                teamManager: result.data.teamManager,
                events: result.data.events,
                phone: result.data.phone,
                photoUrl: response[4].data?.url,
                aadharUrl: response[5].data?.url,
                sslcUrl: response[0].data?.url,
                pucUrl: response[1].data?.url,
                admission1Url: response[2].data?.url,
                admission2Url: response[6].data?.url,
                idcardUrl: response[3].data?.url,
                userId: userId,
            };
            
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const dataDB = await insertRegistrant(registrantDB,user.events);
    
            return NextResponse.json(
                { success: true, message: "registered successful" },
                { status: 200 }
            );
        } catch (error) {
            return NextResponse.json({ success: false, error: error }, { status: 400 });
        }
    }

    // if the registrant is user then we can register him with this only id file and photo file

    //upload the files to the file uploader
   
    //get the response from the url and file uploader and then save the url to the database

    //save the registerants db
}

// id userId-relation(users)  name   usn     type    photo  paymentstatus  events(list)   aadhar 10thmarks 12marks addmission idcard
