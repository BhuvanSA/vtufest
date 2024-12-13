import { PrismaClient } from '@prisma/client'
import { connect } from 'http2';

const prisma = new PrismaClient()

interface Registrant{
    name : string,
    usn : string,
    type : any,
    photoUrl : string,
    aadharUrl : string,
    sslcUrl : string,
    pucUrl : string,
    admissionUrl : string,
    idcardUrl : string,
    userId : string,
}

export async function insertRegistrant(arg : any){


    const values = {
        name: arg.name,
        usn: arg.usn,
        type: arg.type,  // Ensure type is valid enum
        phone: arg.phone,
        photoUrl: arg.photoUrl,
        sslcUrl: arg.sslcUrl,
        pucUrl: arg.pucUrl,
        admissionUrl: arg.admissionUrl,
        idcardUrl: arg.idcardUrl,
        userId: arg.userId,
        verified: false,
        aadharUrl : arg.aadharUrl
    }
    console.log(values)

    const registrant = await prisma.registrants.create({
        data:{
            name : values.name,
            usn :values.usn,
            type: values.type,  // Ensure type is valid enum
            phone: values.phone,
            photoUrl: values.photoUrl,
            sslcUrl: values.sslcUrl,
            pucUrl: values.pucUrl,
            aadharUrl : values.aadharUrl,
            admissionUrl: values.admissionUrl,
            idcardUrl: values.idcardUrl,
            userId: values.userId,
        }
    })
    console.log(registrant);
    console.log("it is savee");
    console.log(arg.events.map((event:any)=>({
        id : event.id
    })))
    console.log(registrant.id)

        const events = await Promise.all(
        arg.events.map((event: any) =>
          prisma.events.update({
            where: {
              userId_eventNo: {
                userId: arg.userId,
                eventNo: event.id,  // Make sure this matches the correct event number
              },
            },
            data: {
              registrants: {
                connect: { id: registrant.id },  // Connect registrant by their ID
              },
            },
          })
        )
      );
      console.log(events);
    console.log("the above e")


    const eventRegistrant = await Promise.all(
        events.map((event:any)=>
            prisma.eventRegistrations.create({
                data: {
                    registrantId : registrant.id,
                    eventId : event.id
                }
            })
        ))
    
    console.log(eventRegistrant);    
    
    
    
    // console.log(registrant)
    // console.log("saved");

    // console.log(registrant);
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
        },
        include:{
            events:true,
            eventRegistrations:true
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
        },
        include:{
            eventRegistrations:true,
            events:true
        }
    });

    if (!registrant) {
        return "no "
    }

    // Update the `events` array
    
   
    // Update the registrant's record
    const updatedRegistrant = await prisma.eventRegistrations.update({
        where:{
        registrantId_eventId: {
            registrantId: registrant.id,  // Use the registrant's ID
            eventId          // Use the event's ID
        }},
        data:{
            attendanceStatus:true
        }
    });


    return updatedRegistrant; // Return the updated registrant if needed
}


export async function markVerified(usn:string){
   

    const updatedRegistrant  = await prisma.registrants.update({
        where:{
            usn,
        },
        data:{
            verified:true
        }
    })

    return updatedRegistrant;
}

export async function registerUserEvents(userId:string,events:any){
    
    const userEvents = await prisma.events.createMany({
        data:events.map((event:any)=>({
            userId,
            eventName:event.eventName,
            eventNo : event.eventNo
        }))
    })

    return userEvents;
}

export async function getAllEventsByUser(userId:string) {
    console.log(userId)
    const userEvents = await prisma.events.findMany({
        where:{
            userId:userId
        }
    })  
    return userEvents;
}

