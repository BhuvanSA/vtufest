"use client";

import { useEffect, useState } from "react";
import { DataTable, Data } from "@/components/register/data-table";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// TODO: convert this to a Server Side Rendered page by direclty fetching data from the database
// Create better UI to display all selected events
// better ui for the Add and submit button, maybe use a loading button if required
// convert any types to proper types
// seperate out the columns from data-table

export default function Page() {
    const [rows, setRows] = useState<Data[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function getAllregistrant() {
            const res = await fetch("/api/getallregister", {
                method: "GET",
                credentials: "include", // Ensure cookies are included
            });
            const { registrant = [] } = await res.json();

            // Convert backend response to Data array
            const listData: Data[] = registrant.map((item: any) => ({
                id: item.id,
                photo: item.photoUrl ?? "https://via.placeholder.com/150",
                name: item.name || "N/A",
                usn: item.usn || "N/A",
                type: item.teamManager ? "Team Manager" : "Participant",
                events: item.events?.map((e: any) => e.eventName) ?? [],
                status: "pending", // or any default logic
            }));

            setRows(listData);
            console.log(listData);
        }
        getAllregistrant();
    }, []);

    const handleUpdate = (id: string) => {
        router.push(`/register/updateregister/${id}`);
    };

    const handleRemove = async (id: string) => {
        const updatedRows = rows.filter((row) => row.id !== id);
        try {
            const response = await fetch("/api/deleteregister", {
                method: "DELETE",
                body: JSON.stringify({ registrantId: id }),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Ensure cookies are included
            });

            const data = await response.json();
            alert(data.message);
            setRows(updatedRows);
        } catch (err: unknown) {
            alert("An error occurred while removing the registrant.");
            console.error(err);
        }
    };

    return (
        <div>
            <div className="mt-4 justify-center flex flex-col gap-4">
                <h1 className="flex justify-center">Registrants</h1>
                <div className="flex justify-center">
                    Events registered from all registrants
                </div>
                {/* map all the events in the list data */}
                <div className="justify-center flex flex-wrap gap-4">
                    {rows.map((item) => {
                        return (
                            <div className="flex gap-4" key={item.id}>
                                {item.events.map((event) => {
                                    return (
                                        <Badge className="" key={event}>
                                            {event}
                                        </Badge>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
            <Button
                onClick={() => router.push("/register/addevent")}
                className="mt-4"
            >
                Add Events
            </Button>
            <DataTable
                data={rows}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
            />
            <div className="flex justify-center mt-4 gap-4">
                <Button
                    onClick={() => router.push("/register/documentupload")}
                    className=""
                    disabled={rows?.length > 45}
                >
                    Add
                </Button>
                <Button
                    className=""
                    onClick={() => router.push("/paymentinfo")}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
}
