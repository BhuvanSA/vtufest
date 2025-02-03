import prisma from "@/lib/db";
import { DataTable, Data } from "@/components/register/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Type } from "@prisma/client";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { PenSquare, UserPlus, CreditCard } from "lucide-react";

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
        redirect("/auth/signin");
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
            .map((r) => ({ eventName: r.eventName! }));

        const accompanistEvents = row.registrations
            .filter((r) => r.type === "ACCOMPANIST" && r.eventName)
            .map((r) => ({ eventName: r.eventName! }));

        const participantAccompanistEvents = row.registrations
            .filter((r) => r.type === 'ACCOMPANIST' || r.type === 'PARTICIPANT')
            .map((r) => ({ eventName: r.eventName! }));





        // If no events at all, push a single blank record
        if (!hasEvents) {
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



        // If participant
        if (participantEvents.length > 0) {
            results.push({
                id: `${row.registrantId}#PARTICIPANT`,
                name: row.name,
                usn: row.usn,
                photo: row.photoUrl,
                type: "Participant",
                events: participantEvents,
                status: docStatusMap[row.docStatus],
            });
        }

        // If accompanist
        if (accompanistEvents.length > 0) {
            results.push({
                id: `${row.registrantId}#ACCOMPANIST`,
                name: row.name,
                usn: row.usn,
                photo: row.photoUrl,
                type: "Accompanist",
                events: accompanistEvents,
                status: docStatusMap[row.docStatus],
            });
        }
        if (participantAccompanistEvents.length > 0) {
            results.push({
                id: `${row.registrantId}#PARTICIPANT, ACCOMPANIST`,
                name: row.name,
                usn: row.usn,
                photo: row.photoUrl,
                type: "Participant, Accompanist",
                events: participantAccompanistEvents,
                status: docStatusMap[row.docStatus],
            });
            continue;
        }

    }

    return (
        <div className="bg-background min-h-screen pt-24">
            <div className="mt-4 justify-center flex flex-col gap-4">
                <div className="max-w-4xl mx-auto p-4">
                    <h1 className="text-primary font-bold text-5xl md:text-5xl xl:text-5xl mb-6">
                        Registrant List
                    </h1>
                </div>
            </div>
            <DataTable data={results} />
            <div className="flex justify-center mt-4 gap-4 pb-36">
                <Link href="/register/modifyevents">
                    <Button
                        variant="outline"
                        className="border bg-primary text-white hover:bg-primary hover:text-white hover:scale-105 transition-all"
                    >
                        <PenSquare className="mr-2 h-4 w-4" />
                        Modify Events
                    </Button>
                </Link>
                <Link href="/register/addRegistrant">
                    <Button
                        variant="outline"
                        className="border bg-primary text-white hover:bg-primary hover:text-white hover:scale-105 transition-all"
                    >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Registrant
                    </Button>
                </Link>
                <Link href="/register/paymentinfo">
                    <Button variant="default"
                    className="border bg-primary text-white hover:bg-primary hover:text-white hover:scale-105 transition-all"
                    >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Go to payments
                    </Button>
                </Link>
            </div>
        </div> 
    );
}
