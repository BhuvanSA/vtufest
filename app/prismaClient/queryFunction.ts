import { PrismaClient, type,Prisma} from '@prisma/client'



const prisma = new PrismaClient()
interface Registrant{
    name : string,
    usn : string,
    teamManager : boolean,
    phone : string,
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
        teamManager: arg.teamManager,  // Ensure type is valid enum
        phone: arg.phone,
        photoUrl: arg.photoUrl,
        sslcUrl: arg.sslcUrl,
        pucUrl: arg.pucUrl,
        admission1Url: arg.admission1Url,
        admission2Url : arg.admission2Url,
        idcardUrl: arg.idcardUrl,
        userId: arg.userId,
        verified: false,
        aadharUrl : arg.aadharUrl
    }
    console.log("values",values)

    if(arg.teamManager === true){
        const registrant = await prisma.registrants.create({
            data:{
                name : values.name,
                usn :values.usn,
                teamManager: true,  // Ensure type is valid enum
                phone: values.phone,
                photoUrl: values.photoUrl,
                sslcUrl: values.sslcUrl,
                pucUrl: values.pucUrl,
                aadharUrl : values.aadharUrl,
                admission1Url: values.admission1Url,
                admission2Url : values.admission2Url,
                idcardUrl: values.idcardUrl,
                userId: values.userId,
            }
        })
        return registrant;
    }

    const alleventList = await getAllEventsByUser(arg.userId);

    console.log("all event list ",alleventList)

    const eventList = [];

   

    arg.events.forEach((x:any)=>{
        let selectedEvent = alleventList.find(y=> parseInt(y.eventNo)===parseInt(x.eventNo))
        
        if(x.type === 'PARTICIPANT'){
            if(selectedEvent.maxParticipant >= selectedEvent.registeredParticipant+1){
                selectedEvent.registeredParticipant += 1;
                eventList.push({...selectedEvent,type:x.type});
            }
        }
        else if(x.type === 'ACCOMPANIST'){
            if(selectedEvent.maxAccompanist >= selectedEvent.registeredAccompanist+1){
                selectedEvent.registeredAccompanist +=1;
                eventList.push({...selectedEvent,type:x.type});
            }
        }
    })


    
    console.log("the final list ",eventList);

    const registrant = await prisma.registrants.create({
        data:{
            name : values.name,
            usn :values.usn,
            teamManager: false,  
            phone: values.phone,
            photoUrl: values.photoUrl,
            sslcUrl: values.sslcUrl,
            pucUrl: values.pucUrl,
            aadharUrl : values.aadharUrl,
            admission1Url: values.admission1Url,
            admission2Url : values.admission2Url,
            idcardUrl: values.idcardUrl,
            userId: values.userId,
        }
    })
    console.log(registrant);
    console.log("it is savee");

    
        let events = await Promise.all(
        eventList.map((event: any) =>
          prisma.events.update({
            where: {
              userId_eventNo: {
                userId: arg.userId,
                eventNo: parseInt(event.eventNo),  // Make sure this matches the correct event number
              },
            },
            data: {
              registrants: {
                connect: { id: registrant.id },  // Connect registrant by their ID
              },
              registeredParticipant : event.registeredParticipant,
              registeredAccompanist : event.registeredAccompanist
            },
          })
        )
      );
    
      console.log(events);
    console.log("the above e")

    events = events.map((x:any)=>{

        const findEvent = eventList.find(y => y.id===x.id);
        return {...x,type : findEvent.type}
    })

    console.log("the udfaadsfjldkas",events)

    const eventRegistrant = await Promise.all(
        events.map((event:any)=>
            prisma.eventRegistrations.create({
                data: {
                    registrantId : registrant.id,
                    eventId :event.id,
                    type : event.type,
                }
            })
        ))
    
    console.log(eventRegistrant);    
    
    
    
    console.log(registrant)
    console.log("saved");

    console.log(registrant);
    return registrant;
}

export async function getRegistrantsByCollege(arg : any){

    const registerant: Registrant = await prisma.registrants.findMany({
        where:{
            userId: arg.id
        },
        include:{
            events:true
        }
    })
    console.log(registerant);
    return registerant;
}


export async function getUser(id: string){
    const user = await prisma.users.findFirst({
        where:{
            id:id
        }
    });
    console.log(user);
    return user;
}

export async function getRegistrantCount(id: string) {
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
          usn,
        },
        include: {
          eventRegistrations: true,
          events: true,
        },
      });
      console.log(registrant)
      
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
            id:eventId,
        },
      });
      console.log("fdafads",existingRegistration)
      
      if (!existingRegistration) {
        console.log("Event registration not found");
        return "Event registration not found";
      }
      
      console.log("Existing Registration:", existingRegistration);
      
      // Toggle attendanceStatus
      const updatedRegistrant = await prisma.eventRegistrations.update({
        where: {
          id:eventId
        },
        data: {
          attendanceStatus: !existingRegistration.attendanceStatus, // Toggle attendanceStatus
        },
      });
      
      console.log("Updated Attendance Status:", updatedRegistrant.attendanceStatus);
      return updatedRegistrant.attendanceStatus;
      

     // Return the updated registrant if needed
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
    console.log("query",events);
    const userEvents = await prisma.events.createMany({
        data:events.map((event:any)=>({
            userId,
            eventName:event.eventName,
            eventNo : event.eventNo,
            maxParticipant:event.maxParticipant,              
            maxAccompanist : event.maxAccompanist,
            category : event.category         
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

