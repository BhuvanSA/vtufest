import prisma from "@/lib/db";
import { DataTable, Data } from "@/components/register/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Type } from "@prisma/client";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import { DataTableView } from "@/components/register/data-table-view";
import { ArrowLeft } from "lucide-react";


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
    photoUrl: string;
    teamManager: boolean;
    docStatus: keyof typeof docStatusMap;
    registrations: Array<{
        type: Type | null;
        eventName: string | null;
    }>;
}

export default async function Page() {
    const session = await verifySession();
    if (!session) {
        redirect ("/auth/signin");
    }
    const userIdFromSession = session.id as string;

    // Single query with JSON aggregation + user filtering
    const aggregatedData: AggregatedRow[] = await prisma.$queryRaw`
    SELECT
      r.id AS "registrantId",
      r.name,
      r.usn,
      r."photoUrl",
      r."teamManager",
      r."docStatus",
      COALESCE(
        json_agg(
          json_build_object('type', er.type, 'eventName', e."eventName")
        )
        FILTER (WHERE er.id IS NOT NULL),
        '[]'
      ) AS "registrations"
    FROM "Registrants" r
    LEFT JOIN "EventRegistrations" er ON r.id = er."registrantId"
    LEFT JOIN "Events" e ON er."eventId" = e.id
    WHERE r."userId" = ${userIdFromSession}
    GROUP BY r.id
    ORDER BY r.usn
  `;

    // Build final rows for table
    const results: Data[] = [];

    for (const row of aggregatedData) {
        const hasEvents = row.registrations && row.registrations.length > 0;

        // If Team Manager => single "Team Manager" row
        if (row.teamManager) {
            results.push({
                id: `${row.registrantId}#TEAMMANAGER`,
                name: row.name,
                usn: row.usn,
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
            .map((r) => ({ eventName: r.eventName!, role: "Participant" as const }));

        const accompanistEvents = row.registrations
            .filter((r) => r.type === "ACCOMPANIST" && r.eventName)
            .map((r) => ({ eventName: r.eventName!, role: "Accompanist" as const }));


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
                photo: row.photoUrl,
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
            photo: row.photoUrl,
            type: typeLabel,
            events: combinedEvents,
            status: docStatusMap[row.docStatus],
        });

}


return (
    
    <div className="bg-background min-h-screen pt-10">
        <div className="mt-4 justify-center flex flex-col gap-4">
            <div className="max-w-4xl mx-auto p-4">
                <h1 className="text-primary font-bold text-5xl md:text-5xl xl:text-5xl mb-6">
                    Registration List
                </h1>
            </div>
        </div>
        <DataTableView data={results}/>

        <div className="flex w-full items-center justify-center pb-10">
        <Link href={"/auth/countdown"}>
        <Button className="">
        <ArrowLeft className="ml-2 mr-2 h-4 w-4 hover:scale-110 " />GO BACK
        </Button>
        </Link>
        </div>
    </div>
);
}
