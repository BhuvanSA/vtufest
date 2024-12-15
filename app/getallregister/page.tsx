"use client";
import Button from "@/components/Button";
import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Link from Next.js

// Reusable Button Component

const StudentTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    
    async function getAllregistrant() {
        
        const res = await fetch('/api/getallregister',{
            method:"GET",
        })

        const data = await res.json();
        const resData = data.registrant;

        const ListData = [];
        
        resData.forEach((registrant:any,index:number)=>{
            const x = {
                id : index,
                name : registrant.name,
                phone : registrant.phone,
                usn : registrant.usn,
                type : registrant.type,
                totalEvents : registrant.events.length
            }
            ListData.push(x);
        })
        setRows(ListData);
    }
    getAllregistrant()
  }, [])
  

  // Function to remove a row based on its id
  const handleRemove = (id) => {
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
              <th className="border border-gray-300 px-4 py-2">Type</th>
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
                  {row.type}
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
          <Button label="Add" 
          />
        </Link>
        <Button label="Submit" />
      </div>
    </div>
  );
};

export default StudentTable;