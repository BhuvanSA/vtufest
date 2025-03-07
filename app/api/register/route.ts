import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import {
    participantFormSchema,
    managerFormSchema,
} from "@/lib/schemas/register";
import { checkUnique, checkUsnUnique, getUser, insertRegistrant } from "@/app/prismaClient/queryFunction";
import { NextResponse } from "next/server";

export const maxDuration = 60; // This function can run for a maximum of 5 seconds

// Define the Registrant type if not already defined
export type Registrant = {
    name: string;
    usn: string;
    phone: string;
    teamManager: boolean;
    photoUrl: string;
    idcardUrl: string;
    aadharUrl?: string;
    sslcUrl?: string;
    pucUrl?: string;
    admission1Url?: string;
    admission2Url?: string;
    userId: string;
    gender: string;
    blood: string;
    email: string;
    accomodation: boolean;
    designation?: string;
    events: {
        eventNo: number;
        eventName: string;
        type: "PARTICIPANT" | "ACCOMPANIST";
    }[];
};
// filepath: /Users/bhuvansa/Desktop/new/types/UserEventsType.ts
export interface UserEventsType {
    eventNo: number;
    maxParticipant: number;
    maxAccompanist: number;
    registeredParticipant: number;
    registeredAccompanist: number;
}

export async function POST(request: Request) {
    const session = await verifySession();
    if (!session?.id) {
        redirect("/auth/signin");
    }
    const data = await request.json();
    data.usn = String(data.usn).toUpperCase();
    data.email = String(data.email).toUpperCase();
    // Fetch user events from db
    const userId = session.id as string;
    const user = await getUser(userId);
    if (!user) {
        return new Response(JSON.stringify({ message: "User not found" }), {
            status: 404,
        });
    }
    if (user.registrants.length >= 45) {
        return new Response(
            JSON.stringify({
                message:
                    "You have reached the maximum limit of 45 registrations",
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const checkEmailAndPhone = await checkUnique(data.email as string, data.phone as string);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if(checkEmailAndPhone){
        return new Response(
            JSON.stringify({ message: "Registrant with the same email or phone number already exists" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    const checkUsn = await checkUsnUnique(data.usn as string);
    if(checkUsn){
        return new Response(
            JSON.stringify({ message: "Registrant with the same USN/ ID Number already exists" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    if(user.region === "Bengaluru Region (1)" && data.accomodation==="yes"){
        return new Response(
            JSON.stringify({
            message: "Accommodation is not allowed for Bengaluru Region participants",
            }),
            {
            status: 400,
            headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (data.teamManager === false) {
        const validation = participantFormSchema.safeParse(data);
        if (!validation.success) {
            // Extract error messages
            const errors = validation.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            }));
            console.log(errors);

            return new Response(JSON.stringify({ errors }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Map incoming data to include all required Registrant fields
        const registrantData: Registrant = {
            email: validation.data.email,
            name: validation.data.name,
            usn: validation.data.usn,
            phone: validation.data.phone,
            teamManager: validation.data.teamManager,
            photoUrl: validation.data.documents.photo, // Map from documents
            idcardUrl: validation.data.documents.idCard,
            aadharUrl: validation.data.documents.aadhar || "",
            sslcUrl: validation.data.documents.sslc || "",
            pucUrl: validation.data.documents.puc || "",
            admission1Url: validation.data.documents.admission1 || "",
            admission2Url: validation.data.documents.admission2 || "",
            userId: session.id as string, // Type assertion to string
            events: validation.data.events, // Ensure events are included
            gender: validation.data.gender as string,
            accomodation: validation.data.accomodation as boolean,
            blood: validation.data.blood,
        };

        if (
            user.registrants.some(
                (reg) =>
                    reg.usn === registrantData.usn ||
                    reg.phone === registrantData.phone
            )
        ) {
            return new Response(
                JSON.stringify({
                    message:
                        "User with same USN or phone number already exists",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        try {
            await insertRegistrant(registrantData, user.events);
            return new Response(
                JSON.stringify({ message: "Registered successfully" }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        } catch (error: unknown) {
            console.error("Error during registration:", error);
            if (error instanceof Error) {
                return new Response(
                    JSON.stringify({ message: error.message }),
                    {
                        status: 500,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }
            return new Response(
                JSON.stringify({ message: "An unexpected error occurred" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    } else if (data.teamManager === true) {
        const validation = managerFormSchema.safeParse(data);
        if (!validation.success) {
            // Extract error messages
            const errors = validation.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            }));
            console.log("Manager Validation Errors:", errors);

            return new Response(JSON.stringify({ errors }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Map incoming data to include all required Registrant fields
        const registrantData: Registrant = {
            name: validation.data.name,
            email: validation.data.email,
            usn: validation.data.usn,
            phone: validation.data.phone,
            teamManager: validation.data.teamManager,
            photoUrl: validation.data.documents.photo, // Map from documents
            idcardUrl: validation.data.documents.idCard,
            aadharUrl: "", // Not required for Team Manager
            sslcUrl: "", // Not required for Team Manager
            pucUrl: "", // Not required for Team Manager
            admission1Url: "", // Not required for Team Manager
            admission2Url: "", // Not required for Team Manager
            userId: session.id as string, // Type assertion to string
            events: [], // Team Managers do not select events
            accomodation: validation.data.accomodation as boolean,
            gender: validation.data.gender as string,
            blood: validation.data.blood as string,
            designation: validation.data.designation as string,
        };

        // Check for existing registrant with same USN or phone
        if (
            user.registrants.some(
                (reg) =>
                    reg.usn === registrantData.usn ||
                    reg.phone === registrantData.phone
            )
        ) {
            return new Response(
                JSON.stringify({
                    message:
                        "User with same USN or phone number already exists",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        try {
            await insertRegistrant(registrantData, user.events); // Pass empty events array
            return new Response(
                JSON.stringify({ message: "Registered successfully" }),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );
        } catch (error: unknown) {
            console.error("Error during Team Manager registration:", error);
            if (error instanceof Error) {
                return new Response(
                    JSON.stringify({ message: error.message }),
                    {
                        status: 500,
                        headers: { "Content-Type": "application/json" },
                    }
                );
            }
            return new Response(
                JSON.stringify({ message: "An unexpected error occurred" }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }
    }
}
