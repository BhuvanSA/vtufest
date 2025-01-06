import prisma from "@/lib/db";
import { DataTable } from "@/components/register/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Type } from "@prisma/client";

export const docStatusMap = {
    PENDING: "pending",
    PROCESSING: "processing",
    APPROVED: "success",
    REJECTED: "failed",
} as const;

interface AggregatedRow {
    registrantid: string; // from the SELECT
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
    // Single query with JSON aggregation
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
    GROUP BY r.id
    ORDER BY r.usn; 
  `;

    // Build final rows for table
    const results = [];

    for (const row of aggregatedData) {
        const hasEvents = row.registrations && row.registrations.length > 0;

        // If Team Manager => single "Team Manager" row
        if (row.teamManager) {
            results.push({
                id: `${row.registrantid}-TEAMMANAGER`,
                name: row.name,
                usn: row.usn,
                photo: row.photoUrl,
                type: "Team Manager",
                events: [],
                status: docStatusMap[row.docStatus],
            });
            continue;
        }

        // If not a team manager, we gather participant + accompanist events
        const participantEvents = row.registrations
            .filter((r) => r.type === "PARTICIPANT" && r.eventName)
            .map((r) => ({ eventName: r.eventName! }));

        const accompanistEvents = row.registrations
            .filter((r) => r.type === "ACCOMPANIST" && r.eventName)
            .map((r) => ({ eventName: r.eventName! }));

        if (!hasEvents) {
            // Has no events
            results.push({
                id: row.registrantid,
                name: row.name,
                usn: row.usn,
                photo: row.photoUrl,
                type: "",
                events: [],
                status: docStatusMap[row.docStatus],
            });
        } else {
            // Possibly multiple rows: one for participant, one for accompanist
            if (participantEvents.length > 0) {
                results.push({
                    id: `${row.registrantid}-PARTICIPANT`,
                    name: row.name,
                    usn: row.usn,
                    photo: row.photoUrl,
                    type: "Participant",
                    events: participantEvents,
                    status: docStatusMap[row.docStatus],
                });
            }
            if (accompanistEvents.length > 0) {
                results.push({
                    id: `${row.registrantid}-ACCOMPANIST`,
                    name: row.name,
                    usn: row.usn,
                    photo: row.photoUrl,
                    type: "Accompanist",
                    events: accompanistEvents,
                    status: docStatusMap[row.docStatus],
                });
            }
        }
    }

    return (
        <div className="bg-background min-h-screen pt-24">
            <div className="mt-4 justify-center flex flex-col gap-4">
                <div className="max-w-4xl mx-auto p-4">
                    <h1 className="text-primary font-bold text-4xl md:text-6xl xl:text-7xl mb-6">
                        Registrants
                    </h1>
                </div>
            </div>
            <DataTable data={results} />
            <div className="flex justify-center mt-4 gap-4">
                <Link href="/register/modifyevents">
                    <Button>Modify Events</Button>
                </Link>
                <Link href="/register/documentupload">
                    <Button>Add Registrant</Button>
                </Link>
                <Link href="/register/paymentinfo">
                    <Button>Submit</Button>
                </Link>
            </div>
        </div>
    );
}
