import { NextResponse } from "next/server";

export async function POST(request : Request){
    const { username , password} = await request.json();

    // check username and password is not null

    console.log(username,password);

    // get the user details from the db

    // check user exist first from the database

    // get decrypt and check the password

    // if password is good then jwt set and the auth is successful

    // else retrurn back auth - not authorized

    return NextResponse.json({success : true})
}

// refer the user schema (register - route)