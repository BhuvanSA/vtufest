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

    const registrant = await prisma.registrants.create({data :registrantData});

    console.log("saved");

    console.log(registrant);
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