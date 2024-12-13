// "use client"
// import { DocumentsList } from '@/components/getRegister/DocumentsList';
// import { EventsList } from '@/components/getRegister/EventsList';
// import { UserProfile } from '@/components/getRegister/UserProfile';
// import { UserData } from '@/lib/user';
// import { usePathname, useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';


// const userData = {
//   id: 1,
//   name: "Sohan K E",
//   usn: "1GA21IS001",
//   type: "TEAMMANAGER",
//   events: [
//     "Hackathon",
//     "Cultural Fest",
//     "Tech Talk"
//   ],
//   photoUrl: "https://example.com/photos/sohan.jpg",
//   aadharUrl: "https://example.com/docs/aadhar.pdf",
//   sslcUrl: "https://example.com/docs/sslc.pdf",
//   pucUrl: "https://example.com/docs/puc.pdf",
//   admissionUrl: "https://example.com/docs/admission.pdf",
//   idcardUrl: "https://example.com/docs/idcard.pdf",
//   userId: "1"
// };

// function GetRegister({ params }: { params: Promise<{ slug: string }>}) {
  
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [eventsList, setEventsList] = useState([]);
//   const [usn,setUsn] = useState("");

//   useEffect(()=>{

//     async function getparams(){
//       const para = (await params).slug;
//       console.log("the params ",para);


//       const response = await fetch(`/api/getregister/${para}`,{
//         method:"GET",
//       })
//       const data = await response.json();
//       console.log(data.response)

//        setUserData(data.response);
//       setEventsList(data.response.events);
//       setUsn(para)
//       console.log(data.response.photoUrl);
//     }
//     getparams();
    
    
//   },[])
  
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Dashboard</h1>
//         <div className="space-y-6">

//           <UserProfile user={userData.usn} />
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <EventsList events={eventsList} />
//             {/* <DocumentsList user={userData} /> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GetRegister;
"use client";
import Button from "@/components/Button";
import React, { useState } from "react";
import Link from "next/link"; // Import Link from Next.js

// Reusable Button Component

const StudentTable = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      name: "Nisha",
      phone: "8374372389",
      usn: "1ga22is098",
      category: "Dance",
      totalEvents: 3,
    },
    {
      id: 2,
      name: "Chandana",
      phone: "9277264623",
      usn: "1ga22cs021",
      category: "Music",
      totalEvents: 1,
    },
    {
      id: 3,
      name: "Rahul",
      phone: "7877264623",
      usn: "1ga22cs066",
      category: "Literary",
      totalEvents: 2,
    },
    {
      id: 4,
      name: "Likith",
      phone: "9277264623",
      usn: "1ga22cs050",
      category: "Drama",
      totalEvents: 2,
    },
    {
      id: 5,
      name: "Priya",
      phone: "9876543210",
      usn: "1ga22is045",
      category: "Music",
      totalEvents: 3,
    },
    {
      id: 6,
      name: "Sanjay",
      phone: "9034765321",
      usn: "1ga22cs032",
      category: "Sports",
      totalEvents: 4,
    },
    {
      id: 7,
      name: "Divya",
      phone: "8123456789",
      usn: "1ga22is078",
      category: "Dance",
      totalEvents: 1,
    },
    {
      id: 8,
      name: "Anil",
      phone: "9988776655",
      usn: "1ga22cs015",
      category: "Debate",
      totalEvents: 2,
    },
  ]);

  // Function to remove a row based on its id
  const handleRemove = (id: number) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Student Entries</h1>
      <h2 className="text-1xl text-center text-red-600 font-bold">
        45 entries is the limit!
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">USN</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Total Events</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {row.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">{row.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">{row.usn}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {row.category}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {row.totalEvents}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center flex space-x-2 justify-center">
                  <Button
                    label="Edit"
                    OnClick={() => alert(`Edit row with ID ${row.id}`)}
                  />
                  <Button label="Remove" OnClick={() => handleRemove(row.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Button with Link */}
      <div className="mt-4 text-center justify-center flex space-x-4">
        <Link href="/register">
          <Button label="Add" />
        </Link>
        <Button label="Submit" />
      </div>
    </div>
  );
};

export default StudentTable;