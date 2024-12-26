import { utapi } from "@/utils/uploadthing";
import { PrismaClient, Type } from "@prisma/client";

const prisma = new PrismaClient();
interface Registrant {
    name: string;
    usn: string;
    teamManager: boolean;
    phone: string;
    photoUrl: string;
    aadharUrl?: string;
    sslcUrl?: string;
    pucUrl?: string;
    admissionUrl?: string;
    idcardUrl: string;
    userId: string;
}

export async function insertRegistrant(arg: any, userEvents: any) {
    if (arg.teamManager === true) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const registrant = await prisma.registrants.create({
                data: {
                    name: arg.name,
                    usn: arg.usn,
                    teamManager: true,
                    phone: arg.phone,
                    photoUrl: arg.photoUrl,
                    idcardUrl: arg.idcardUrl,
                    userId: arg.userId,
                },
            });
            return registrant;
        } catch (err: any) {
            throw new Error(err);
        }
    }

    const eventList: any[] = [];

    arg.events.forEach((x: any) => {
        const selectedEvent = userEvents.find(
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

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const registrant = await prisma.registrants.create({
                data: {
                    name: arg.name,
                    usn: arg.usn,
                    teamManager: false,
                    phone: arg.phone,
                    photoUrl: arg.photoUrl,
                    sslcUrl: arg.sslcUrl,
                    pucUrl: arg.pucUrl,
                    aadharUrl: arg.aadharUrl,
                    admission1Url: arg.admission1Url,
                    admission2Url: arg.admission2Url,
                    idcardUrl: arg.idcardUrl,
                    userId: arg.userId,
                },
            });

            const events = await Promise.all(
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
                            registeredParticipant: event.registeredParticipant,
                            registeredAccompanist: event.registeredAccompanist,
                        },
                    })
                )
            );

            const updatedEvents = events.map((x: any) => {
                const findEvent = eventList.find((y) => y.id === x.id);
                return { ...x, type: findEvent.type };
            });

            const eventRegistrant = await Promise.all(
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
    } catch (err: any) {
        throw new Error(err);
    }
}

export async function getRegistrantsByCollege(arg: any) {
    const registerant: Registrant = await prisma.registrants.findMany({
        where: {
            userId: arg.id,
        },
        include: {
            events: true,
        },
    });
    console.log(registerant);
    return registerant;
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
}

export async function getRegistrantByPhone(id: string) {
    const registerant = await prisma.registrants.findFirst({
        where: {
            phone: id,
        },
    });

    return registerant;
}

export async function updateRegistrant(usn: string, eventId: string) {
    // Fetch the registrant
    const registrant = await prisma.registrants.findFirst({
        where: {
            usn,
        },
        include: {
            eventRegistrations: true,
            events: true,
        },
    });
    console.log(registrant);

    if (!registrant) {
        console.log("Registrant not found for the provided USN");
        return "Registrant not found";
    }

    console.log("Registrant ID:", registrant.id);
    console.log("Event ID:", eventId);

    const registrantId = registrant.id;

    // Fetch the current attendanceStatus
    const existingRegistration = await prisma.eventRegistrations.findUnique({
        where: {
            id: eventId,
        },
    });
    console.log("fdafads", existingRegistration);

    if (!existingRegistration) {
        console.log("Event registration not found");
        return "Event registration not found";
    }

    console.log("Existing Registration:", existingRegistration);

    // Toggle attendanceStatus
    const updatedRegistrant = await prisma.eventRegistrations.update({
        where: {
            id: eventId,
        },
        data: {
            attendanceStatus: !existingRegistration.attendanceStatus, // Toggle attendanceStatus
        },
    });

    console.log("Updated Attendance Status:", updatedRegistrant.attendanceStatus);
    return updatedRegistrant.attendanceStatus;

    // Return the updated registrant if needed
}

export async function markVerified(usn: string) {
    const updatedRegistrant = await prisma.registrants.update({
        where: {
            usn,
        },
        data: {
            verified: true,
        },
    });

    return updatedRegistrant;
}

export async function registerUserEvents(userId: string, events: any) {
    console.log("query", events);
    const userEvents = await prisma.events.createMany({
        data: events.map((event: any) => ({
            userId,
            eventName: event.eventName,
            eventNo: event.eventNo,
            maxParticipant: event.maxParticipant,
            maxAccompanist: event.maxAccompanist,
            category: event.category,
        })),
    });

    return userEvents;
}

export async function getAllEventsByUser(userId: string) {
    console.log(userId);
    const userEvents = await prisma.events.findMany({
        where: {
            userId: userId,
        },
    });
    return userEvents;
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
                    }
                    else if (event.type === "ACCOMPANIST") {
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
        })
    } catch (err) {
        throw new Error(err);
    }
}


export async function deleteEvent(id: string) {
    try {
        const dbQuery = await prisma.events.delete({
            where: {
                id: id,
            }
        })
        return dbQuery;
    }
    catch (err: any) {
        throw new Error(err);
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
                events: true
            }
        })
        return dbQuery;
    } catch (err) {
        throw new Error(err);
    }

}

export async function updateRegisterDetails(data: any) {
    try {
        const updatedRegister = await prisma.registrants.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                usn: data.usn,
                phone: data.phone
            }
        })
    }
    catch (err) {
        throw new Error(err);
    }
}

export async function updateEventRole(eventId: string, type: any) {

    try {
        if (type === 'ACCOMPANIST') {
            const getRole = await prisma.eventRegistrations.findFirst({
                where: {
                    id: eventId
                },
                include: {
                    event: true
                }
            })
            if (!getRole) {
                throw new Error("Invalid Registrant unauthorized");
            }
            if (getRole.event.registeredAccompanist + 1 <= getRole.event.maxAccompanist) {
                console.log("hello")
                const updateRole = await prisma.eventRegistrations.update({
                    where: {
                        id: eventId
                    },
                    data: {
                        type: type,
                    },
                    include: {
                        event: true
                    }
                });
                const updateEventCount = await prisma.events.update({
                    where: {
                        userId_eventNo: {
                            userId: updateRole.event.userId,
                            eventNo: updateRole.event.eventNo
                        }
                    },
                    data: {
                        registeredAccompanist: {
                            increment: 1
                        },
                        registeredParticipant: {
                            decrement: 1
                        }
                    }
                })
                return updateRole;
            }
            else {
                throw new Error("accompanist is invalid")
            }

        }
        else if (type === "PARTICIPANT") {
            const getRole = await prisma.eventRegistrations.findFirst({
                where: {
                    id: eventId
                },
                include: {
                    event: true
                }
            })
            if (!getRole) {
                throw new Error("Invalid Registrant unauthorized");
            }

            if (getRole.event.registeredParticipant + 1 <= getRole.event.maxParticipant) {
                const updateRole = await prisma.eventRegistrations.update({
                    where: {
                        id: eventId
                    },
                    data: {
                        type: type,
                    },
                    include: {
                        event: true
                    }
                });
                const updateEventCount = await prisma.events.update({
                    where: {
                        userId_eventNo: {
                            userId: updateRole.event.userId,
                            eventNo: updateRole.event.eventNo
                        }
                    },
                    data: {
                        registeredAccompanist: {
                            decrement: 1
                        },
                        registeredParticipant: {
                            increment: 1
                        }
                    }
                })


                return updateRole;

            }
            else {
                throw new Error("participant invalid")
            }

        }

    }
    catch (err) {
        throw new Error(err);
    }
}

export async function updateFile(registrantId: string, file: File, field: string) {

    const registrant = await prisma.registrants.findFirst({
        where: {
            id: registrantId
        }
    })
    const FileUpload = await utapi.uploadFiles([file]);
    console.log("the upload thing file upl;oad", FileUpload)

    if (field === "sslc") {
        const FileTobeDeletedURL = registrant?.sslcUrl;
        const updatedRegistrant = await prisma.registrants.update({
            where: {
                id: registrantId
            },
            data: {
                sslcUrl: FileUpload[0].data?.url
            }
        })

        if (FileTobeDeletedURL) {
            const deleteFileUpload = await utapi.deleteFiles(FileTobeDeletedURL.split("/").pop() as string);
        }

    }
    else if (field === "puc") {
        const FileTobeDeletedURL = registrant?.sslcUrl;
        const updatedRegistrant = await prisma.registrants.update({
            where: {
                id: registrantId
            },
            data: {
                pucUrl: FileUpload[0].data?.url
            }
        })
        console.log("file deleted ", FileTobeDeletedURL);
        if (FileTobeDeletedURL) {
            const deleteFileUpload = await utapi.deleteFiles(FileTobeDeletedURL.split("/").pop() as string);
        }
    }
    else if (field === "idcard") {
        const FileTobeDeletedURL = registrant?.sslcUrl;
        const updatedRegistrant = await prisma.registrants.update({
            where: {
                id: registrantId
            },
            data: {
                idcardUrl: FileUpload[0].data?.url
            }
        })
        console.log("file deleted ", FileTobeDeletedURL);
        if (FileTobeDeletedURL) {
            const deleteFileUpload = await utapi.deleteFiles(FileTobeDeletedURL.split("/").pop() as string);
        }
    }
    else if (field === "aadhar") {
        const FileTobeDeletedURL = registrant?.sslcUrl;
        const updatedRegistrant = await prisma.registrants.update({
            where: {
                id: registrantId
            },
            data: {
                aadharUrl: FileUpload[0].data?.url
            }
        })
        console.log("file deleted ", FileTobeDeletedURL.substring(FileTobeDeletedURL.indexOf('f') + 2));
        if (FileTobeDeletedURL) {
            const deleteFileUpload = await utapi.deleteFiles(FileTobeDeletedURL.split("/").pop() as string);
        }

    }
    else if (field === "admission1") {
        const FileTobeDeletedURL = registrant?.sslcUrl;
        const updatedRegistrant = await prisma.registrants.update({
            where: {
                id: registrantId
            },
            data: {
                admission1Url: FileUpload[0].data?.url
            }
        })
        console.log(FileTobeDeletedURL.split("/").pop() as string)
        if (FileTobeDeletedURL) {
            const deleteFileUpload = await utapi.deleteFiles(FileTobeDeletedURL.split("/").pop() as string);
        }
    }
    else if (field === "admission2") {
        const FileTobeDeletedURL = registrant?.sslcUrl;
        const updatedRegistrant = await prisma.registrants.update({
            where: {
                id: registrantId
            },
            data: {
                admission2Url: FileUpload[0].data?.url
            }
        })
        if (FileTobeDeletedURL) {
            const deleteFileUpload = await utapi.deleteFiles(FileTobeDeletedURL.split("/").pop() as string);
        }
    }
    else if (field === "photo") {
        const FileTobeDeletedURL = registrant?.sslcUrl;
        const updatedRegistrant = await prisma.registrants.update({
            where: {
                id: registrantId
            },
            data: {
                photoUrl: FileUpload[0].data?.url
            }
        })
        if (FileTobeDeletedURL) {
            const deleteFileUpload = await utapi.deleteFiles(FileTobeDeletedURL.split("/").pop() as string);
        }
    }
    return true;
}


export async function deleteEventOfRegistrant(eventId: string) {

    try {
        const deleteQuery = await prisma.eventRegistrations.delete({
            where: {
                id: eventId
            },
            include: {
                event: true
            }
        })

        if (deleteQuery.type === "ACCOMPANIST") {
            const updateQuery = await prisma.events.update({
                where: {
                    id: deleteQuery.eventId
                },
                data: {
                    registeredAccompanist: {
                        decrement: 1
                    }
                }
            })
        }
        else if (deleteQuery.type === "PARTICIPANT") {
            const updateQuery = await prisma.events.update({
                where: {
                    id: deleteQuery.eventId
                },
                data: {
                    registeredParticipant: {
                        decrement: 1
                    }
                }
            })
        }
    }
    catch (err) {
        throw new Error(err)
    }
}

export async function AddEvent(registrantId: string, event: any,type:any) {

    const eventRegistrantAdd = await prisma.eventRegistrations.create({
        data: {
            registrantId: registrantId,
            eventId: event.id,
            type: type
        },
        include: {
            event: true
        }
    })
    if (type === "ACCOMPANIST") {
        const addEvent = await prisma.events.update({
            where: {
                id: eventRegistrantAdd.eventId
            },
            data: {
                registeredAccompanist: {
                    increment: 1
                },
                registrants:{
                    connect:{
                        id:registrantId
                    }
                }
            }
        })
    }
    else if (type === "PARTICIPANT") {
        const addEvent = await prisma.events.update({
            where: {
                id: eventRegistrantAdd.eventId
            },
            data: {
                registeredParticipant: {
                    increment: 1
                },
                registrants:{
                    connect:{
                        id:registrantId
                    }
                }
            }
        })
    }
}