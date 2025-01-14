import { savePayment } from "@/app/prismaClient/queryFunction";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function POST(request:Request){

    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);
    // verify the jwt
    if (!session) {
        return NextResponse.json(
            { success: false, message: "unauthorized" },
            { status: 401 }
        );
    }
    const userId: string = session.id as string;

    const {txnNumber,paymentUrl,Amount} = await request.json();
    console.log(txnNumber,paymentUrl,Amount,userId);

    try{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const paymentResult = await savePayment(userId ,txnNumber,paymentUrl,parseInt(Amount));
    return NextResponse.json({success:true,message:"Payment Details are saved"},{status:200});
    }
    catch(err){
        return NextResponse.json(
            { success: false, message: err },
            { status: 500 }
        );
    }
}