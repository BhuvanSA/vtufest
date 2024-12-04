import { NextResponse } from "next/server";

export async function POST(request : Request){
    const { collegeName, collegeCode, phone, userName } = await request.json();
    
    // check the params are not null

    console.log(collegeName,collegeCode,phone,userName)

    // check the collegeCode account already exists first


    // get the random uuid for the user register


    // get the password generated of minimum length and admin password

    // hash the password and admin password - admin password has authority to update the registered members



    // send sms(username collegeName collegeID with the login password and college -  adminpassword) and save to the db

    return NextResponse.json({success : true})
}

// id(uuid)   collegeName  collegeCode    phone   userName    password    adminpassword   


// JWT must me made 