import { deleteRegistrant, getUser } from "@/app/prismaClient/queryFunction";
import { verifySession } from "@/lib/session";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    const body = await request.json();
    const session = await verifySession();
    if (!session?.id) {
        redirect("/auth/signin");
    }
    const userId: string = session.id as string;
    const user = await getUser(userId);
    if (!user) {
        return NextResponse.json(
            { success: false, message: "User not found" },
            { status: 404 }
        );
    }
    const { registrantId } = body;
    if (!registrantId) {
        return NextResponse.json(
            { success: false, message: "Registrant not found" },
            { status: 404 }
        );
    }

    if (
        !user.registrants.some(
            (registrant: { id: string }) => registrant.id === registrantId
        )
    ) {
        return NextResponse.json(
            { success: false, message: "Registrant not found" },
            { status: 404 }
        );
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const userEvents = await deleteRegistrant(registrantId);

        return NextResponse.json(
            { success: true, message: "Registrant Deleted" },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            { success: false, message: err },
            { status: 500 }
        );
    }
}
