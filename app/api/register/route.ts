import { getUser, insertRegistrant } from "@/app/prismaClient/queryFunction";
import { verifySession } from "@/lib/session";
import { utapi } from "../uploadthing/uploadthing";
import { redirect } from "next/navigation";
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

const eventSchema = z
    .object({
        eventName: z.string().min(1, { message: "Event name cannot be empty" }),
        eventNo: z.number(),
        type: z.enum(["PARTICIPANT", "ACCOMPANIST"]),
    })
    .strict();

const registrantSchema = z
    .object({
        name: z.string().min(1, { message: "Name cannot be empty" }),
        usn: z.string().min(1, { message: "Usn cannot be empty" }),
        phone: z
            .string()
            .min(10, "Invalid phone Number must be of 10 digits")
            .refine((value) => /^\d+$/.test(value), {
                message: "Phone number must contain only digits",
            }),
        teamManager: z.boolean(),
        events: z.array(eventSchema),
        photo: fileSchema,
        aadhar: fileSchema,
        sslc: fileSchema,
        puc: fileSchema,
        admission1: fileSchema,
        admission2: fileSchema,
        idcard: fileSchema,
    })
    .strict();

const TeamMangerRegistrantSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    usn: z.string().min(1, { message: "Usn/Id Number cannot be empty" }),
    phone: z
        .string()
        .min(10, "Invalid phone Number must be of 10 digits")
        .refine((value) => /^\d+$/.test(value), {
            message: "Phone number must contain only digits",
        }),
    teamManager: z.boolean(),
    photo: fileSchema,
    idcard: fileSchema,
});

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

    const session = await verifySession();
    if (!session) {
        redirect("/auth/signin");
    }

    const userId: string = session.id as string;
    const user = await getUser(userId);

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

    if (
        user.registrants.some(
            (reg) =>
                reg.usn === registrant.usn || reg.phone === registrant.phone
        )
    ) {
        return NextResponse.json(
            { success: false, message: "Registrant already exists" },
            { status: 400 }
        );
    }

    let result = null;

    if (registrant.teamManager === true) {
        result = TeamMangerRegistrantSchema.safeParse(registrant);
        console.log(result);
        if (!result.success) {
            const errorMessages = result.error.errors
                .map((err) => err.message)
                .join(", ");
            return NextResponse.json(
                { success: false, message: errorMessages },
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
                photoUrl: response[0].data?.url as string,
                idcardUrl: response[1].data?.url as string,
                userId: userId,
            };

            // save the registrant into the DB
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const dataDB = await insertRegistrant(registrantDB, null);

            return NextResponse.json(
                { success: true, message: "Registered Successful" },
                { status: 200 }
            );
        } catch (err: any) {
            return NextResponse.json(
                { success: false, message: err.message },
                { status: 400 }
            );
        }
    } else {
        result = registrantSchema.safeParse(registrant);
        console.log(result.error?.message);
        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.error.message },
                { status: 400 }
            );
        }

        if (result.data.events.length == 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Atleast one event must registered",
                },
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
                photoUrl: response[4].data?.url as string,
                aadharUrl: response[5].data?.url as string,
                sslcUrl: response[0].data?.url as string,
                pucUrl: response[1].data?.url as string,
                admission1Url: response[2].data?.url as string,
                admission2Url: response[6].data?.url as string,
                idcardUrl: response[3].data?.url as string,
                userId: userId,
            };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const dataDB = await insertRegistrant(registrantDB, user.events);

            return NextResponse.json(
                { success: true, message: "registered successful" },
                { status: 200 }
            );
        } catch (error: any) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 400 }
            );
        }
    }
}
