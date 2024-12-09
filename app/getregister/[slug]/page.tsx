"use client"
import { DocumentsList } from '@/components/getRegister/DocumentsList';
import { EventsList } from '@/components/getRegister/EventsList';
import { UserProfile } from '@/components/getRegister/UserProfile';
import { UserData } from '@/lib/user';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const userData = {
  id: 1,
  name: "Sohan K E",
  usn: "1GA21IS001",
  type: "TEAMMANAGER",
  events: [
    "Hackathon",
    "Cultural Fest",
    "Tech Talk"
  ],
  photoUrl: "https://example.com/photos/sohan.jpg",
  aadharUrl: "https://example.com/docs/aadhar.pdf",
  sslcUrl: "https://example.com/docs/sslc.pdf",
  pucUrl: "https://example.com/docs/puc.pdf",
  admissionUrl: "https://example.com/docs/admission.pdf",
  idcardUrl: "https://example.com/docs/idcard.pdf",
  userId: "1"
};

function GetRegister({ params }: { params: Promise<{ slug: string }>}) {
  
  const [userData, setUserData] = useState<UserData | null>(null);
  const [eventsList, setEventsList] = useState([]);

  const path = usePathname()
  useEffect(()=>{

    async function getparams(){
      const para = (await params).slug;
      console.log("the params ",para);


      const response = await fetch(`/api/getregister/${para}`,{
        method:"GET",
      })
      const data = (await response.json())
      console.log(data.response)

       setUserData(data.response);
      setEventsList(data.response.events);
      
      console.log(data.response.photoUrl);
    }
    getparams();
    
    
  },[])
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
        <div className="space-y-6">

          <UserProfile user={userData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventsList events={eventsList} />
            <DocumentsList user={userData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetRegister;