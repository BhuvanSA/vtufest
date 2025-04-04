import prisma from "@/lib/db";
import {  Data } from "@/components/register/registrations-view-table";
import { Type } from "@prisma/client";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { DataTable} from "@/components/register/registrations-view-table";

// import DataTableSkeleton from "@/components/register/data-table-skeleton";

export const docStatusMap = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    APPROVED: "Success",
    REJECTED: "Failed",
} as const;

interface AggregatedRow {
    registrantId: string;
    name: string;
    usn: string;
    collegeName: string;
    photoUrl: string;
    email: string;
    phone: string;
    collegeRegion: string;
    collegeCode: string;
    designation?: string;
    aadharUrl: string;
    sslcUrl?: string;
    idcardUrl : string;
    dateOfBirth: string;
    gender: string;
    accomodation: boolean;
    teamManager: boolean;
    docStatus: keyof typeof docStatusMap;
    registrations: Array<{
        type: Type | null;
        eventName: string | null;
    }>;
}

export default async function Page() {
    const session = await verifySession();
    if (!session || session.role != "REGISTRATION_TEAM") {
        redirect("/auth/signin");
    }

    // Single query with JSON aggregation + user filtering
    const aggregatedData: AggregatedRow[] = await prisma.$queryRaw`
    SELECT
      r.id AS "registrantId",
      r.name,
      r.usn,
      r."photoUrl",
      r."teamManager",
      r."docStatus",
      u."collegeName" AS "collegeName",
      u."region" AS "collegeRegion",
      u."collegeCode" AS "collegeCode",
      r."designation" AS "designation",
      r."email" AS "email",
      r."phone" AS "phone",
      r."aadharUrl" AS "aadharUrl",
      r."sslcUrl" AS "sslcUrl",
      r."idcardUrl" AS "idcardUrl", 
      r.gender,
      r.accomodation,
      r."blood" AS "dateOfBirth",
      COALESCE(
        json_agg(
          json_build_object('type', er.type, 'eventName', e."eventName")
        )
        FILTER (WHERE er.id IS NOT NULL),
        '[]'
      ) AS "registrations"
    FROM "Registrants" r
    LEFT JOIN "Users" u ON r."userId" = u.id
    LEFT JOIN "EventRegistrations" er ON r.id = er."registrantId"
    LEFT JOIN "Events" e ON er."eventId" = e.id
    GROUP BY r.id, u."collegeName" , u."region" , u."collegeCode" 
    ORDER BY r.usn
  `;
    console.log(aggregatedData);

    // Build final rows for table
    const results: Data[] = [];

    for (const row of aggregatedData) {
        const hasEvents = row.registrations && row.registrations.length > 0;
        // If Team Manager => single "Team Manager" row
        if (row.teamManager) {
            results.push({
                id: `${row.registrantId}#TEAMMANAGER`,
                collegeName: row.collegeName,
                name: row.name,
                usn: row.usn,
                email : row.email,
                phone : row.phone,
                accomodation: row.accomodation,
                collegeRegion: row.collegeRegion,
                collegeCode: row.collegeCode,
                designation: row.designation,
                aadharUrl: row.aadharUrl,
                sslcUrl: row.sslcUrl,
                gender: row.gender,
                idcardUrl: row.idcardUrl,
                dateOfBirth: row.dateOfBirth,
                photo: row.photoUrl,
                type: "Team Manager",
                events: [],
                status: docStatusMap[row.docStatus],
            });
            console.log(row.registrantId, "is a team manager");
            continue;
        }

        // Otherwise gather participant + accompanist events
        const participantEvents = row.registrations
            .filter((r) => r.type === "PARTICIPANT" && r.eventName)
            .map((r) => ({
                eventName: r.eventName!,
                role: "Participant" as const,
            }));

        const accompanistEvents = row.registrations
            .filter((r) => r.type === "ACCOMPANIST" && r.eventName)
            .map((r) => ({
                eventName: r.eventName!,
                role: "Accompanist" as const,
            }));

        // Determine type label based on available events
        let typeLabel = "";
        if (participantEvents.length > 0 && accompanistEvents.length > 0) {
            typeLabel = "Participant/Accompanist";
        } else if (participantEvents.length > 0) {
            typeLabel = "Participant";
        } else if (accompanistEvents.length > 0) {
            typeLabel = "Accompanist";
        }

        // If no events or type not determined, push a blank record
        if (!hasEvents || typeLabel === "") {
            results.push({
                id: row.registrantId,
                name: row.name,
                usn: row.usn,
                collegeName: row.collegeName,
                photo: row.photoUrl,
                email : row.email,
                phone : row.phone,
                accomodation: row.accomodation,
                collegeRegion: row.collegeRegion,
                collegeCode: row.collegeCode,
                designation: row.designation,
                aadharUrl: row.aadharUrl,
                sslcUrl: row.sslcUrl,
                gender : row.gender,
                idcardUrl: row.idcardUrl,
                dateOfBirth: row.dateOfBirth,
                type: "",
                events: [],
                status: docStatusMap[row.docStatus],
            });
            continue;
        }

        // Combine events with role information
        const combinedEvents = [...participantEvents, ...accompanistEvents];

        results.push({
            id: `${row.registrantId}#${typeLabel.toUpperCase()}`,
            name: row.name,
            usn: row.usn,
            collegeName: row.collegeName,
            photo: row.photoUrl,
            type: typeLabel,
            email : row.email,
            phone : row.phone,
            accomodation: row.accomodation,
            collegeRegion: row.collegeRegion,
            collegeCode: row.collegeCode,
            designation: row.designation,
            aadharUrl: row.aadharUrl,
            sslcUrl: row.sslcUrl,
            gender: row.gender,
            idcardUrl: row.idcardUrl,
            dateOfBirth: row.dateOfBirth,
            events: combinedEvents,
            status: docStatusMap[row.docStatus],
        });
    }

    return (
        <div className="bg-background min-h-screen pt-10">
            <div className="mt-4 justify-center flex flex-col gap-4">
                <div className="max-w-4xl mx-auto p-4">
                    <h1 className="text-primary font-bold text-5xl md:text-5xl xl:text-5xl mb-6">
                        Registration Team : All registrants
                    </h1>
                </div>
            </div>
            <div className="flex justify-center mt-4 gap-4 mb-3 flex-wrap ">
          
            </div>

            <DataTable data={results} />
    
        </div>
    );
}
