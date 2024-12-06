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

export async function getRegistrant(arg : any){

    const registerant: Registrant = await prisma.registrants.findUnique({
        where:{
            usn:arg.usn
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