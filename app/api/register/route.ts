import { insertRegistrant } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export async function POST(request : Request){
    
    const data = await request.json();

    // jpg - (idcard) and (passport photo)
    // pdf - (10 and 12 marks card) and (admission to BE) and (aadhar card)
    console.log(data.name, data.usn,data.type,data.events);

    // check all the data exists

    // check for jwt token

    //get the data from the jwt of the college and then map it to the registerant

    // limit to the 45 registerants

    //upload the files to the file uploader

    //get the response from the url and file uploader and then save the url to the database

    //save the registerants db

    const dataDB = await insertRegistrant(data)
    console.log("this is db api",dataDB);

    return NextResponse.json({success:true});
}

// id userId-relation(users)  name   usn     type    photo  paymentstatus  events(list)   aadhar 10thmarks 12marks addmission idcard 