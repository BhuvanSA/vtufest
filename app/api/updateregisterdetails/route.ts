import { checkEmailUnique, checkPhoneUnique, checkUnique, checkUsnUnique, getRegistrantById, updateRegisterDetails } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
    id: z.string({ message: "id is required" }),
    name: z.string({ message: "name is required" }).min(3, "enter the valid name"),
    phone: z.string().min(10, "Invalid phone Number must be of 10 digits")
        .refine((value) => /^\d+$/.test(value), {
            message: "Phone number must contain only digits",
        }),
    usn: z.string({ message: "usn is required" }),
    gender: z.string({ message: "gender is required" }),
    accomodation: z.boolean({ message: "accomodation is required" }),
    blood: z.string({ message: "date of birth is required" }),
    email: z.string({ message: "email is required" }),
    designation: z.string({ message: "designation is required" })
});

export interface RegistrantDetailUpdate {
    id: string;
    name: string;
    designation?: string;
    phone: string;
    usn: string;
    gender: string;
    accomodation: boolean;
    blood: string;
    email: string;
}

export async function PATCH(request: Request) {

    const data = await request.json();

    const result = await registerSchema.safeParse(data);


    if (!result.success) {
        const errors = result.error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
        }));
        console.log(errors);

        return new Response(JSON.stringify({ errors }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {

        const findRegistrant = await getRegistrantById(result.data.id);

        const checkPhone = await checkPhoneUnique(result.data.phone);

        const checkEmail = await checkEmailUnique(result.data.email);


        if (checkPhone && findRegistrant?.phone !== result.data.phone) {
            return NextResponse.json({ success: false, message: "phone number already exists" }, { status: 500 });
        }

        if (checkEmail && findRegistrant?.email !== result.data.email) {
            return NextResponse.json({ success: false, message: "email already exists" }, { status: 500 });
        }

        const checkUsn = await checkUsnUnique(result.data.usn);

        if (checkUsn && findRegistrant?.usn !== result.data.usn) {
            return NextResponse.json({ success: false, message: "usn already exists" }, { status: 500 });
        }


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const updateDetails = await updateRegisterDetails(data);
        return NextResponse.json({ success: true, message: "updated" }, { status: 200 });
    }
    catch (err) {
        return NextResponse.json({ success: false, message: err }, { status: 400 })
    }

}