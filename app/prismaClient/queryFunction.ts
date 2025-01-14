import { Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { EventCreate } from "../api/eventsregister/route";
import { RegistrantDetailUpdate } from "../api/updateregisterdetails/route";
import { UpdateRole } from "../api/updateroleinevent/route";
import type { AddEvent } from "../api/addeventregister/route";

interface Registrant {
    name: string;
    usn: string;
    teamManager: boolean;
    phone: string;
    photoUrl: string;
    aadharUrl?: string;
    sslcUrl?: string;
    pucUrl?: string;
    admission1Url?: string;
    admission2Url?: string;
    idcardUrl: string;
    userId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    events?: any[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function insertRegistrant(arg: Registrant, userEvents: any) {
    try {
        if (arg.teamManager === true) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            try {
                const registrant = await prisma.registrants.create({
                    data: {
                        name: arg.name as string,
                        usn: arg.usn as string,
                        teamManager: true,
                        phone: arg.phone as string,
                        photoUrl: arg.photoUrl as string,
                        idcardUrl: arg.idcardUrl as string,
                        userId: arg.userId,
                    },
                });
                return registrant;
            } catch (err: unknown) {
                if (err instanceof Prisma.PrismaClientKnownRequestError) {
                    // Handle specific Prisma error codes
                    console.log(err);
                    switch (err.code) {
                        case "P2002":
                            console.log(
                                `Unique constraint failed on the field: ${err.meta?.target}`
                            );
                            throw new Error(
                                `Unique constraint failed on the field: ${err.meta?.target}`
                            );
                        case "P2025":
                            console.log("Record not found");
                            throw new Error("Record not found");
                        default:
                            console.log(`Prisma error: ${err.message}`);
                            throw new Error(`Prisma error: ${err.message}`);
                    }
                } else if (err instanceof Prisma.PrismaClientValidationError) {
                    console.log(err.message);
                    throw new Error(`Validation error: ${err.message}`);
                } else {
                    // Generic error handling
                    console.log("Unexpected error:", err);
                    if (err instanceof Error) {
                        console.log(err.message);
                        throw new Error(
                            err.message || "An unexpected error occurred"
                        );
                    } else {
                        throw new Error("An unexpected error occurred");
                    }
                }
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const eventList: any[] = [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        arg?.events?.forEach((x: any) => {
            const selectedEvent = userEvents.find(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (y: any) => parseInt(y.eventNo) === parseInt(x.eventNo)
            );

            if (x.type === "PARTICIPANT") {
                if (
                    selectedEvent.registeredParticipant + 1 <=
                    selectedEvent.maxParticipant
                ) {
                    selectedEvent.registeredParticipant += 1;
                    eventList.push({ ...selectedEvent, type: x.type });
                }
            } else if (x.type === "ACCOMPANIST") {
                if (
                    selectedEvent.registeredAccompanist + 1 <=
                    selectedEvent.maxAccompanist
                ) {
                    selectedEvent.registeredAccompanist += 1;
                    eventList.push({ ...selectedEvent, type: x.type });
                }
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = await prisma.$transaction(async (prisma) => {
            const registrant = await prisma.registrants.create({
                data: {
                    name: arg.name as string,
                    usn: arg.usn as string,
                    teamManager: false,
                    phone: arg.phone as string,
                    photoUrl: arg.photoUrl as string,
                    sslcUrl: arg.sslcUrl as string,
                    pucUrl: arg.pucUrl as string,
                    aadharUrl: arg.aadharUrl as string,
                    admission1Url: arg.admission1Url as string,
                    admission2Url: arg.admission2Url as string,
                    idcardUrl: arg.idcardUrl as string,
                    userId: arg.userId,
                },
            });

            const events = await Promise.all(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                eventList.map((event: any) =>
                    prisma.events.update({
                        where: {
                            userId_eventNo: {
                                userId: arg.userId,
                                eventNo: parseInt(event.eventNo), // Make sure this matches the correct event number
                            },
                        },
                        data: {
                            registrants: {
                                connect: { id: registrant.id }, // Connect registrant by their ID
                            },
                            registeredParticipant: parseInt(
                                event.registeredParticipant
                            ),
                            registeredAccompanist: parseInt(
                                event.registeredAccompanist
                            ),
                        },
                    })
                )
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updatedEvents = events.map((x: any) => {
                const findEvent = eventList.find((y) => y.id === x.id);
                return { ...x, type: findEvent.type };
            });

            const eventRegistrant = await Promise.all(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                updatedEvents.map((event: any) =>
                    prisma.eventRegistrations.create({
                        data: {
                            registrantId: registrant.id,
                            eventId: event.id,
                            type: event.type,
                        },
                    })
                )
            );
            return { registrant, events, eventRegistrant };
        });
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            console.log(err);
            switch (err.code) {
                case "P2002":
                    console.log(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    console.log("Record not found");
                    throw new Error("Record not found");
                default:
                    console.log(`Prisma error: ${err.message}`);
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            console.log(err.message);
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.log("Unexpected error:", err);
            if (err instanceof Error) {
                console.log(err.message);
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
}

export async function getRegistrantsByCollege(arg: string) {
    try {
        const registerant = await prisma.registrants.findMany({
            where: {
                userId: arg,
            },
            include: {
                events: true,
            },
        });
        return registerant;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            switch (err.code) {
                case "P2002":
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    throw new Error("Record not found");
                default:
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.error("Unexpected error:", err);
            if (err instanceof Error) {
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
}

export async function getUser(id: string) {
    const user = await prisma.users.findFirst({
        where: {
            id: id,
        },
        include: {
            registrants: true,
            events: true,
        },
    });
    console.log(user);
    return user;
}

export async function getRegistrantCount(id: string) {
    const count = await prisma.registrants.count({ where: { userId: id } });
    return count;
}

export async function getRegistrant(usn: string) {
    try {
        const registrant = await prisma.registrants.findUnique({
            where: {
                usn: usn,
            },
            include: {
                events: true,
                eventRegistrations: true,
            },
        });
        return registrant;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error(`Database error occurred: ${err.message}`);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error occurred: ${err.message}`);
        } else if (err instanceof Error) {
            throw new Error(`Unexpected error occurred: ${err.message}`);
        } else {
            throw new Error(
                "An unknown error occurred while registering events."
            );
        }
    }
}

export async function getRegistrantByPhone(id: string) {
    try {
        const registerant = await prisma.registrants.findFirst({
            where: {
                phone: id,
            },
        });
        return registerant;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error(`Database error occurred: ${err.message}`);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error occurred: ${err.message}`);
        } else if (err instanceof Error) {
            throw new Error(`Unexpected error occurred: ${err.message}`);
        } else {
            throw new Error(
                "An unknown error occurred while registering events."
            );
        }
    }
}

export async function updateRegistrant(usn: string, eventId: string) {
    // Fetch the registrant
    try {
        const result = await prisma.$transaction(async (prisma) => {
            const registrant = await prisma.registrants.findFirst({
                where: {
                    usn,
                },
                include: {
                    eventRegistrations: true,
                    events: true,
                },
            });

            if (!registrant) {
                return "Registrant not found";
            }

            // Fetch the current attendanceStatus
            const existingRegistration =
                await prisma.eventRegistrations.findUnique({
                    where: {
                        id: eventId,
                    },
                });

            if (!existingRegistration) {
                return "Event registration not found";
            }

            // Toggle attendanceStatus
            const updatedRegistrant = await prisma.eventRegistrations.update({
                where: {
                    id: eventId,
                },
                data: {
                    attendanceStatus: !existingRegistration.attendanceStatus, // Toggle attendanceStatus
                },
            });
            return updatedRegistrant.attendanceStatus;
        });
        return result;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error(`Database error occurred: ${err.message}`);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error occurred: ${err.message}`);
        } else if (err instanceof Error) {
            throw new Error(`Unexpected error occurred: ${err.message}`);
        } else {
            throw new Error(
                "An unknown error occurred while registering events."
            );
        }
    }

    // Return the updated registrant if needed
}

export async function markVerified(usn: string) {
    try {
        const updatedRegistrant = await prisma.registrants.update({
            where: {
                usn,
            },
            data: {
                verified: true,
            },
        });
        return updatedRegistrant;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error(`Database error occurred: ${err.message}`);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error occurred: ${err.message}`);
        } else if (err instanceof Error) {
            throw new Error(`Unexpected error occurred: ${err.message}`);
        } else {
            throw new Error(
                "An unknown error occurred while registering events."
            );
        }
    }
}

export async function registerUserEvents(
    userId: string,
    events: EventCreate[]
) {
    try {
        const userEvents = await prisma.events.createMany({
            data: events.map((event: EventCreate) => ({
                userId,
                eventName: event.eventName,
                eventNo: event.eventNo,
                maxParticipant: event.maxParticipant,
                maxAccompanist: event.maxAccompanist,
                category: event.category,
            })),
        });
        return userEvents;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error(`Database error occurred: ${err.message}`);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error occurred: ${err.message}`);
        } else if (err instanceof Error) {
            throw new Error(`Unexpected error occurred: ${err.message}`);
        } else {
            throw new Error(
                "An unknown error occurred while registering events."
            );
        }
    }
}

export async function getAllEventsByUser(userId: string) {
    try {
        const userEvents = await prisma.events.findMany({
            where: {
                userId: userId,
            },
        });
        return userEvents;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            throw new Error(`Database error occurred: ${err.message}`);
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error occurred: ${err.message}`);
        } else if (err instanceof Error) {
            throw new Error(`Unexpected error occurred: ${err.message}`);
        } else {
            throw new Error(
                "An unknown error occurred while registering events."
            );
        }
    }
}

export async function deleteRegistrant(registrantId: string) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const transaction = await prisma.$transaction(async (prisma) => {
            const userEvents = await prisma.registrants.delete({
                where: {
                    id: registrantId,
                },
                include: {
                    eventRegistrations: true,
                },
            });

            const eventsUpdate = await Promise.all(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                userEvents.eventRegistrations.map(async (event: any) => {
                    if (event.type === "PARTICIPANT") {
                        await prisma.events.update({
                            where: {
                                id: event.eventId,
                            },
                            data: {
                                registeredParticipant: {
                                    decrement: 1,
                                },
                            },
                        });
                    } else if (event.type === "ACCOMPANIST") {
                        await prisma.events.update({
                            where: {
                                id: event.eventId,
                            },
                            data: {
                                registeredAccompanist: {
                                    decrement: 1,
                                },
                            },
                        });
                    }
                })
            );
            return { userEvents, eventsUpdate };
        });
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            switch (err.code) {
                case "P2002":
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    throw new Error("Record not found");
                default:
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.error("Unexpected error:", err);
            if (err instanceof Error) {
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
}

export async function deleteEvent(id: string) {
    try {
        const result = await prisma.$transaction(async (prisma) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const dbQuery = await prisma.events.delete({
                where: {
                    id: id,
                },
            });

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const dbQuery2 = await prisma.eventRegistrations.deleteMany({
                where: {
                    eventId: id,
                },
            });
        });

        return result;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            switch (err.code) {
                case "P2002":
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    throw new Error("Record not found");
                default:
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.error("Unexpected error:", err);
            if (err instanceof Error) {
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
}

export async function getRegistrantById(id: string) {
    try {
        const dbQuery = await prisma.registrants.findFirst({
            where: {
                id,
            },
            include: {
                eventRegistrations: true,
                events: true,
            },
        });
        return dbQuery;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            switch (err.code) {
                case "P2002":
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    throw new Error("Record not found");
                default:
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.error("Unexpected error:", err);
            if (err instanceof Error) {
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
}

export async function updateRegisterDetails(data: RegistrantDetailUpdate) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const updatedRegister = await prisma.registrants.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                usn: data.usn,
                phone: data.phone,
            },
        });
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            switch (err.code) {
                case "P2002":
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    throw new Error("Record not found");
                default:
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.error("Unexpected error:", err);
            if (err instanceof Error) {
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
}

export async function updateEventRole(data: UpdateRole) {
    try {
        if (data.type === "ACCOMPANIST") {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = await prisma.$transaction(async (prisma) => {
                const getRole = await prisma.eventRegistrations.findFirst({
                    where: {
                        id: data.eventRegistrantId,
                    },
                    include: {
                        event: true,
                    },
                });

                if (!getRole) {
                    throw new Error("Invalid Registrant unauthorized");
                }
                if (
                    getRole.event.registeredAccompanist + 1 <=
                    getRole.event.maxAccompanist
                ) {
                    const updateRole = await prisma.eventRegistrations.update({
                        where: {
                            id: data.eventRegistrantId,
                        },
                        data: {
                            type: data.type,
                        },
                        include: {
                            event: true,
                        },
                    });
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const updateEventCount = await prisma.events.update({
                        where: {
                            userId_eventNo: {
                                userId: updateRole.event.userId,
                                eventNo: updateRole.event.eventNo,
                            },
                        },
                        data: {
                            registeredAccompanist: {
                                increment: 1,
                            },
                            registeredParticipant:
                                updateRole.event.registeredParticipant > 0
                                    ? {
                                          decrement: 1,
                                      }
                                    : 0,
                        },
                    });
                    return updateEventCount;
                } else {
                    return null;
                }
            });
        } else if (data.type === "PARTICIPANT") {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = await prisma.$transaction(async (prisma) => {
                const getRole = await prisma.eventRegistrations.findFirst({
                    where: {
                        id: data.eventRegistrantId,
                    },
                    include: {
                        event: true,
                    },
                });
                if (!getRole) {
                    throw new Error("Invalid Registrant unauthorized");
                }

                if (
                    getRole.event.registeredParticipant + 1 <=
                    getRole.event.maxParticipant
                ) {
                    const updateRole = await prisma.eventRegistrations.update({
                        where: {
                            id: data.eventRegistrantId,
                        },
                        data: {
                            type: data.type,
                        },
                        include: {
                            event: true,
                        },
                    });
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const updateEventCount = await prisma.events.update({
                        where: {
                            userId_eventNo: {
                                userId: updateRole.event.userId,
                                eventNo: updateRole.event.eventNo,
                            },
                        },
                        data: {
                            registeredParticipant: {
                                increment: 1,
                            },
                            registeredAccompanist:
                                updateRole.event.registeredAccompanist > 0
                                    ? {
                                          decrement: 1,
                                      }
                                    : 0,
                        },
                    });

                    return updateEventCount;
                } else {
                    return null;
                }
            });
        }
        return null;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            switch (err.code) {
                case "P2002":
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    throw new Error("Record not found");
                default:
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.error("Unexpected error:", err);
            if (err instanceof Error) {
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
}

export async function updateFile(
    registrantId: string,
    file: File,
    field: string
) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = await prisma.$transaction(async (prisma) => {
            const registrant = await prisma.registrants.findFirst({
                where: {
                    id: registrantId,
                },
            });
            const FileUpload = await utapi.uploadFiles([file]);
            console.log("???????????", FileUpload[0].data);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!registrant) {
                throw new Error("Registrant not found");
            }
            const FileTobeDeletedURL: string = (registrant as any)[
                field
            ] as string;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const updatedRegistrant = await prisma.registrants.update({
                where: {
                    id: registrantId,
                },
                data: {
                    [field]: FileUpload[0].data?.url,
                },
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            if (FileTobeDeletedURL) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const deleteFileUpload = await utapi.deleteFiles(
                    FileTobeDeletedURL.split("/").pop() as string
                );
            }
        });
        return result;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            switch (err.code) {
                case "P2002":
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    throw new Error("Record not found");
                default:
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.error("Unexpected error:", err);
            if (err instanceof Error) {
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
}

export async function deleteEventOfRegistrant(eventId: string) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = await prisma.$transaction(async (prisma) => {
            const deleteQuery = await prisma.eventRegistrations.delete({
                where: {
                    id: eventId,
                },
                include: {
                    event: true,
                },
            });

            if (deleteQuery.type === "ACCOMPANIST") {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const updateQuery = await prisma.events.update({
                    where: {
                        id: deleteQuery.eventId,
                    },
                    data: {
                        registeredAccompanist: {
                            decrement: 1,
                        },
                    },
                });
            } else if (deleteQuery.type === "PARTICIPANT") {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const updateQuery = await prisma.events.update({
                    where: {
                        id: deleteQuery.eventId,
                    },
                    data: {
                        registeredParticipant: {
                            decrement: 1,
                        },
                    },
                });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const deleteQueryRegister = await prisma.events.update({
                where: {
                    id: deleteQuery.eventId,
                },
                data: {
                    registrants: {
                        disconnect: { id: deleteQuery.registrantId },
                    },
                },
            });
        });
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            switch (err.code) {
                case "P2002":
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    throw new Error("Record not found");
                default:
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.error("Unexpected error:", err);
            if (err instanceof Error) {
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
}

export async function AddEvent(arg: AddEvent) {
    try {
        const result = await prisma.$transaction(async (prisma) => {
            const eventRegistrantAdd = await prisma.eventRegistrations.create({
                data: {
                    registrantId: arg.registrantId,
                    eventId: arg.event.id,
                    type: arg.type,
                },
                include: {
                    event: true,
                },
            });
            if (arg.type === "ACCOMPANIST") {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const addEvent = await prisma.events.update({
                    where: {
                        id: eventRegistrantAdd.eventId,
                    },
                    data: {
                        registeredAccompanist: {
                            increment: 1,
                        },
                        registrants: {
                            connect: {
                                id: arg.registrantId,
                            },
                        },
                    },
                });
            } else if (arg.type === "PARTICIPANT") {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const addEvent = await prisma.events.update({
                    where: {
                        id: eventRegistrantAdd.eventId,
                    },
                    data: {
                        registeredParticipant: {
                            increment: 1,
                        },
                        registrants: {
                            connect: {
                                id: arg.registrantId,
                            },
                        },
                    },
                });
            }
        });
        return result;
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            switch (err.code) {
                case "P2002":
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    throw new Error("Record not found");
                default:
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.error("Unexpected error:", err);
            if (err instanceof Error) {
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
}


export async function savePayment(userId:string,txnNumber:string,paymentUrl:string,Amount:number){
    try{
        await prisma.users.update({
            where:{
                id:userId
            },
            data:{
                txnNumber,
                paymentUrl,
                Amount,
            }
        });
    } catch (err: unknown) {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma error codes
            switch (err.code) {
                case "P2002":
                    throw new Error(
                        `Unique constraint failed on the field: ${err.meta?.target}`
                    );
                case "P2025":
                    throw new Error("Record not found");
                default:
                    throw new Error(`Prisma error: ${err.message}`);
            }
        } else if (err instanceof Prisma.PrismaClientValidationError) {
            throw new Error(`Validation error: ${err.message}`);
        } else {
            // Generic error handling
            console.error("Unexpected error:", err);
            if (err instanceof Error) {
                throw new Error(err.message || "An unexpected error occurred");
            } else {
                throw new Error("An unexpected error occurred");
            }
        }
    }
    
}
