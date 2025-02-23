import { deleteEvent} from "@/app/prismaClient/queryFunction";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request : Request){
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    // verify the jwt
    if (!session) {
        return NextResponse.json(
            { success: false, message: "unauthorized" },
            { status: 401 }
        );
    }

    const {eventId} = await request.json();

    if(!eventId){
        return NextResponse.json(
            {success: false, message: "No event selected"},
            {status: 400}
        );
    }  

    try{
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const deletedEvent = await deleteEvent(eventId as string);
    return NextResponse.json({success:true,message:"Event Deleted"},{status:200});
    }
    catch(err){
        return NextResponse.json({success:false,message:err},{status:400});
    }
}