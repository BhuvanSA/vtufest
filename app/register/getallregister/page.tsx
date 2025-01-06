import prisma from "@/lib/db";
import { DataTable } from "@/components/register/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const docStatusMap: Record<
    string,
    "pending" | "processing" | "success" | "failed"
> = {
    PENDING: "pending",
    PROCESSING: "processing",
    APPROVED: "success",
    REJECTED: "failed",
};

export default async function Page() {
    // Single-query fetch
    const registrants = await prisma.registrants.findMany({
        include: {
            eventRegistrations: {
                include: {
                    event: {
                        select: {
                            eventName: true,
                        },
                    },
                },
            },
        },
    });

    // Transform into DataTable format
    const results = registrants.flatMap((r) => {
        // Group by type
        const mapByType: Record<string, { eventName: string }[]> = {};
        r.eventRegistrations.forEach((er) => {
            const t =
                er.type === "PARTICIPANT"
                    ? r.teamManager
                        ? "Team Manager"
                        : "Participant"
                    : "Accompanist";
            mapByType[t] = mapByType[t] || [];
            mapByType[t].push({ eventName: er.event.eventName });
        });

        // Build each row
        return Object.keys(mapByType).map((typeKey) => ({
            id: r.id + "-" + typeKey,
            photo: r.photoUrl,
            name: r.name,
            usn: r.usn,
            type: typeKey as "Participant" | "Accompanist",
            events: mapByType[typeKey],
            status: docStatusMap[r.docStatus],
        }));
    });

    return (
        <div className="bg-background min-h-screen pt-24">
            <div className="mt-4 justify-center flex flex-col gap-4">
                <div className="max-w-4xl mx-auto p-4">
                    <h1 className="text-primary font-bold text-4xl md:text-6xl xl:text-7xl mb-6">
                        Registrants
                    </h1>
                </div>
                <div className="flex justify-center">
                    Events registered from all registrants
                </div>
            </div>
            <Link href="/register/eventregister">
                <Button className="mt-4">Add Events</Button>
            </Link>
            <DataTable data={results} />
            <div className="flex justify-center mt-4 gap-4">
                <Link href="/register/documentupload">
                    <Button>add</Button>
                </Link>
                <Link href="/register/paymentinfo">
                    <Button>Submit</Button>
                </Link>
            </div>
        </div>
    );
}
