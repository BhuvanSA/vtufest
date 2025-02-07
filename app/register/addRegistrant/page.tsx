import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import SelectRolesAndEvents from "@/components/register/addFiles";

export type Event = {
    id: string;
    eventNo: number;
    eventName: string;
    userId: string;
    registeredParticipant: number;
    maxParticipant: number;
    registeredAccompanist: number;
    maxAccompanist: number;
    category: string;
};

export default async function Page() {
    const session = await verifySession();
    if (!session) {
        redirect("/auth/signin");
    }
    const userIdFromSession = session.id as string;

    let userEvents: Event[] = [];

    userEvents = await prisma.$queryRaw`
            SELECT *
            FROM "Events"
            WHERE "userId" = ${userIdFromSession}
              AND (
                  "registeredParticipant" < "maxParticipant"
                  OR "registeredAccompanist" < "maxAccompanist"
              )
        `;

    return (
        <div className="bg-background min-h-screen pt-12">
            <div className="mt-4 justify-center flex flex-col gap-4">
                <div className="max-w-4xl mx-auto p-4">
                    <h1 className="text-primary font-bold text-4xl md:text-4xl xl:text-4xl mb-6">
                        Add Registrant
                    </h1>
                </div>
            </div>
            <SelectRolesAndEvents allEvents={userEvents} />
            
        </div>
    );
}
