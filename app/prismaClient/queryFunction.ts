import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface Registrant{
    name : string,
    usn : string,
    type : any,
    events : any,
    photoUrl : string,
    aadharUrl : string,
    sslcUrl : string,
    pucUrl : string,
    admissionUrl : string,
    idcardUrl : string,
    userId : string,
}

export async function insertRegistrant(arg : any){

    const registrantData : Registrant = arg;
    
    console.log(registrantData);
    console.log("inside the dbadfjklas")

    const registrant = await prisma.registrants.create({data :registrantData});
    console.log(registrant)
    console.log("saved");

    console.log(registrant);
    return registrant;
}

export async function getRegistrantsByCollege(arg : any){

    const registerant: Registrant = await prisma.registrants.findMany({
        where:{
            userId: arg.id
        }
    })
    console.log(registerant);
    return registerant;
}

export async function getUser(id : any){
    const user = await prisma.users.findFirst({
        where:{
            id:id
        }
    });
    console.log(user);
    return user;
}

export async function getRegistrantCount(id:any) {
    const count = await prisma.registrants.count({where:{userId : id}})
    return count;
}

export async function getRegistrant(usn : string) {
    const registrant = await prisma.registrants.findUnique({
        where:{
            usn : usn
        }
    })
    return registrant;
}

export async function getRegistrantByPhone(id:string) {
    const registerant = await prisma.registrants.findFirst({
        where:{
            phone : id
        }
    })

    return registerant;
}

export async function updateRegistrant(usn: string, eventId: string) {
    // Fetch the registrant
    const registrant = await prisma.registrants.findFirst({
        where: {
            usn
        }
    });

    if (!registrant) {
        throw new Error(`Registrant with USN ${usn} not found`);
    }

    // Update the `events` array
    const updatedEvents = registrant.events.map(event =>
        event.id === eventId ? { ...event, attended: "attended" } : event
    );

    // Update the registrant's record
    const updatedRegistrant = await prisma.registrants.update({
        where: {
            usn
        },
        data: {
            events: updatedEvents // Updating only the `events` field
        }
    });

    return updatedRegistrant; // Return the updated registrant if needed
}
