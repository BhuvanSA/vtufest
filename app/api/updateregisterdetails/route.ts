import { updateRegisterDetails } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
    id: z.string({ message: "id is required" }),
    name: z.string({ message: "name is required" }).min(3,"enter the valid name"),
    phone: z.string().min(10, "Invalid phone Number must be of 10 digits")
    .refine((value) => /^\d+$/.test(value), {
        message: "Phone number must contain only digits",
    }),
    usn: z.string({ message: "usn is required" }),
}).strict();

export interface RegistrantDetailUpdate {
    id : string,
    name : string,
    phone : string,
    usn : string,
}

export async function PATCH(request: Request) {

    const data = await request.json();

    const result = await registerSchema.safeParse(data);

    if(!result.success){
        return NextResponse.json({success:false,message:result.error.message},{status:400});
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const updateDetails = await updateRegisterDetails(data);
        return NextResponse.json({ success: true, message: "updated" }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ success: false, message: err }, { status: 400 })
    }

}